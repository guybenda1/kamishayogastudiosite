import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const STORAGE_KEY = 'kamisha-site-images-v1';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

interface CachedPayload {
  images: Record<string, string>;
  timestamp: number;
}

interface SiteImagesState {
  images: Record<string, string>;
  initialized: boolean;
  loading: boolean;
  fetchPromise: Promise<void> | null;
  fetchAll: () => Promise<void>;
  getImage: (section: string, defaultImage: string) => string;
  updateImage: (section: string, newImageUrl: string) => Promise<void>;
}

const readCache = (): Record<string, string> => {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: CachedPayload = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return {};
    if (Date.now() - parsed.timestamp > CACHE_TTL_MS) return parsed.images || {};
    return parsed.images || {};
  } catch {
    return {};
  }
};

const writeCache = (images: Record<string, string>) => {
  if (typeof window === 'undefined') return;
  try {
    const payload: CachedPayload = { images, timestamp: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* quota or privacy mode — ignore */
  }
};

export const useSiteImagesStore = create<SiteImagesState>((set, get) => ({
  images: readCache(),
  initialized: false,
  loading: false,
  fetchPromise: null,

  fetchAll: async () => {
    const state = get();
    if (state.fetchPromise) return state.fetchPromise;
    if (state.initialized) return;

    set({ loading: true });

    const promise = (async () => {
      try {
        const { data, error } = await supabase
          .from('site_images')
          .select('section, image_url')
          .eq('is_active', true);

        if (error) throw error;

        const next: Record<string, string> = { ...get().images };
        for (const row of data || []) {
          if (row?.section && row?.image_url) {
            next[row.section] = row.image_url;
          }
        }
        writeCache(next);
        set({ images: next, initialized: true, loading: false, fetchPromise: null });
      } catch (err) {
        console.error('Error loading site images:', err);
        set({ initialized: true, loading: false, fetchPromise: null });
      }
    })();

    set({ fetchPromise: promise });
    return promise;
  },

  getImage: (section, defaultImage) => {
    return get().images[section] || defaultImage;
  },

  updateImage: async (section, newImageUrl) => {
    try {
      await supabase
        .from('site_images')
        .update({ is_active: false })
        .eq('section', section);

      const { error } = await supabase.from('site_images').upsert({
        section,
        image_url: newImageUrl,
        alt_text: `תמונה עבור ${section}`,
        is_active: true,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      const next = { ...get().images, [section]: newImageUrl };
      writeCache(next);
      set({ images: next });
      toast.success('התמונה עודכנה בהצלחה!');
    } catch (err) {
      console.error('Error updating image:', err);
      toast.error('שגיאה בעדכון התמונה');
    }
  },
}));
