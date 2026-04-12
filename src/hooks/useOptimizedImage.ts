import { useState, useEffect } from 'react';

interface UseOptimizedImageProps {
  url: string;
  width?: number;
  quality?: number;
}

interface CachedImage {
  url: string;
  timestamp: number;
}

const imageCache = new Map<string, CachedImage>();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export const useOptimizedImage = ({ url, width = 1200, quality = 80 }: UseOptimizedImageProps) => {
  const [optimizedUrl, setOptimizedUrl] = useState(url);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!url) {
      setLoading(false);
      return;
    }

    const loadOptimizedImage = async () => {
      const cacheKey = `${url}-${width}-${quality}`;

      // Check cache first
      const cached = imageCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        setOptimizedUrl(cached.url);
        setLoading(false);
        return;
      }

      try {
        // Skip optimization for already small URLs or external sources
        if (url.includes('pexels') || url.includes('unsplash') || url.includes('cdninstagram')) {
          setOptimizedUrl(url);
          setLoading(false);
          return;
        }

        // For Supabase storage URLs, add query params directly
        if (url.includes('supabase.co')) {
          const separator = url.includes('?') ? '&' : '?';
          const optimized = `${url}${separator}width=${width}&quality=${quality}&auto=format`;

          imageCache.set(cacheKey, {
            url: optimized,
            timestamp: Date.now(),
          });

          setOptimizedUrl(optimized);
        } else {
          setOptimizedUrl(url);
        }
      } catch (error) {
        console.error('Error optimizing image:', error);
        setOptimizedUrl(url);
      } finally {
        setLoading(false);
      }
    };

    loadOptimizedImage();
  }, [url, width, quality]);

  return { optimizedUrl, loading };
};
