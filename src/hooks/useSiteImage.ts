import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface SiteImage {
  id: string;
  section: string;
  image_url: string;
  alt_text: string;
  is_active: boolean;
}

export const useSiteImage = (section: string, defaultImage: string) => {
  const [imageUrl, setImageUrl] = useState<string>(defaultImage);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadImage();
  }, [section]);

  const loadImage = async () => {
    try {
      const { data, error } = await supabase
        .from('site_images')
        .select('image_url')
        .eq('section', section)
        .eq('is_active', true);

      if (!error && data && data.length > 0 && data[0].image_url !== defaultImage) {
        setImageUrl(data[0].image_url);
      }
    } catch (error) {
      console.error('Error loading image:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateImage = async (newImageUrl: string) => {
    try {
      // First, deactivate existing images for this section
      await supabase
        .from('site_images')
        .update({ is_active: false })
        .eq('section', section);

      // Then insert or update with new image
      const { error } = await supabase
        .from('site_images')
        .upsert({
          section,
          image_url: newImageUrl,
          alt_text: `תמונה עבור ${section}`,
          is_active: true,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setImageUrl(newImageUrl);
      toast.success('התמונה עודכנה בהצלחה!');
    } catch (error) {
      console.error('Error updating image:', error);
      toast.error('שגיאה בעדכון התמונה');
    }
  };

  return { imageUrl, updateImage, loading };
};