import { useEffect, useCallback } from 'react';
import { useSiteImagesStore } from '../store/siteImagesStore';

export const useSiteImage = (section: string, defaultImage: string) => {
  const storedUrl = useSiteImagesStore((s) => s.images[section]);
  const fetchAll = useSiteImagesStore((s) => s.fetchAll);
  const initialized = useSiteImagesStore((s) => s.initialized);
  const updateImageInStore = useSiteImagesStore((s) => s.updateImage);

  useEffect(() => {
    if (!initialized) {
      fetchAll();
    }
  }, [initialized, fetchAll]);

  const updateImage = useCallback(
    (newImageUrl: string) => updateImageInStore(section, newImageUrl),
    [section, updateImageInStore]
  );

  return {
    imageUrl: storedUrl || defaultImage,
    updateImage,
    loading: !initialized && !storedUrl,
  };
};
