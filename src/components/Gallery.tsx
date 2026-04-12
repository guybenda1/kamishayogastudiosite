import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import GalleryImageUploader from './ImageUpload/GalleryImageUploader';
import { supabase } from '../lib/supabase';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useOptimizedImage } from '../hooks/useOptimizedImage';

// Default images as fallback
const defaultImages = [
  { url: "https://eyotdvabnyowlmdqctsg.supabase.co/storage/v1/object/sign/photos/gallery/IMG_8940.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iZjg3OTU2OC05MWUyLTQxYzYtYmU3MC0wMDZiOTcyZmExY2UiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwaG90b3MvZ2FsbGVyeS9JTUdfODk0MC5qcGciLCJpYXQiOjE3NTM1OTA5NjQsImV4cCI6MTc4NTEyNjk2NH0.ZQ0R2mx3P4y0RJYkYRFpZCuluMMAp_O8ghNNDo3NdTc" },
  { url: "https://eyotdvabnyowlmdqctsg.supabase.co/storage/v1/object/sign/photos/gallery/IMG_8702%20copy.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iZjg3OTU2OC05MWUyLTQxYzYtYmU3MC0wMDZiOTcyZmExY2UiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwaG90b3MvZ2FsbGVyeS9JTUdfODcwMiBjb3B5LmpwZyIsImlhdCI6MTc1MzU5MTA2MSwiZXhwIjoxNzg1MTI3MDYxfQ.KlgThyeMH2U8KnDMy4mq0_5RKLQOEod3iUpWrJJEW2g" },
  { url: "https://eyotdvabnyowlmdqctsg.supabase.co/storage/v1/object/sign/photos/gallery/IMG_8444.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iZjg3OTU2OC05MWUyLTQxYzYtYmU3MC0wMDZiOTcyZmExY2UiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwaG90b3MvZ2FsbGVyeS9JTUdfODQ0NC5qcGciLCJpYXQiOjE3NTM1OTEwNzIsImV4cCI6MTc4NTEyNzA3Mn0._5ERk3jntIadYXAlfZBZX5nmaFfHiDHmkDfMbqceMjw" },
  { url: "https://eyotdvabnyowlmdqctsg.supabase.co/storage/v1/object/sign/photos/gallery/IMG_8189.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iZjg3OTU2OC05MWUyLTQxYzYtYmU3MC0wMDZiOTcyZmExY2UiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwaG90b3MvZ2FsbGVyeS9JTUdfODE4OS5qcGciLCJpYXQiOjE3NTM1OTEwODksImV4cCI6MTc4NTEyNzA4OX0.dCstia3bWvcELMIlodEGveIQrw813Mu2pG59KT2l4Gg" },
  { url: "https://eyotdvabnyowlmdqctsg.supabase.co/storage/v1/object/sign/photos/gallery/IMG_5289.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iZjg3OTU2OC05MWUyLTQxYzYtYmU3MC0wMDZiOTcyZmExY2UiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwaG90b3MvZ2FsbGVyeS9JTUdfNTI4OS5qcGciLCJpYXQiOjE3NTM1OTExMTEsImV4cCI6MTc4NTEyNzExMX0.vF4Xl4VT9LJuGJWMjU1uj7ptaQziTLtLGBhgCZZ9i9o" },
  { url: "https://eyotdvabnyowlmdqctsg.supabase.co/storage/v1/object/sign/photos/gallery/IMG_4828.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iZjg3OTU2OC05MWUyLTQxYzYtYmU3MC0wMDZiOTcyZmExY2UiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwaG90b3MvZ2FsbGVyeS9JTUdfNDgyOC5qcGciLCJpYXQiOjE3NTM1OTExNTgsImV4cCI6MTc4NTEyNzE1OH0.DFGmCaBVx5dU9-KIrWanjLuqymyrlPG2Q-0jZeTT0pY" },
  { url: "https://eyotdvabnyowlmdqctsg.supabase.co/storage/v1/object/sign/photos/gallery/IMG_4721.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iZjg3OTU2OC05MWUyLTQxYzYtYmU3MC0wMDZiOTcyZmExY2UiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwaG90b3MvZ2FsbGVyeS9JTUdfNDcyMS5qcGciLCJpYXQiOjE3NTM1OTExNzAsImV4cCI6MTc4NTEyNzE3MH0.hdHMKxuCoF8hc4LiUsq_HQOSg0PTjnO_mAITJlmlSoU" },
  { url: "https://eyotdvabnyowlmdqctsg.supabase.co/storage/v1/object/sign/photos/gallery/IMG_2955.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iZjg3OTU2OC05MWUyLTQxYzYtYmU3MC0wMDZiOTcyZmExY2UiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwaG90b3MvZ2FsbGVyeS9JTUdfMjk1NS5qcGciLCJpYXQiOjE3NTM1OTExODUsImV4cCI6MTc4NTEyNzE4NX0.6pyQD8LM4V4em06x8PeenvmVc72Sk-g1XDDdvar3Q4w" },
  { url: "https://eyotdvabnyowlmdqctsg.supabase.co/storage/v1/object/sign/photos/gallery/IMG_5279.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iZjg3OTU2OC05MWUyLTQxYzYtYmU3MC0wMDZiOTcyZmExY2UiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwaG90b3MvZ2FsbGVyeS9JTUdfNTI3OS5qcGciLCJpYXQiOjE3NTM1OTExMjUsImV4cCI6MTc4NTEyNzEyNX0.4wCsU6MNG-IutdykF80IGR6K80EVEgCA3OdncYcSyiw" }
];

const Gallery = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState<{ url: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const currentImageUrl = images[currentIndex]?.url || '';
  const { optimizedUrl } = useOptimizedImage({ url: currentImageUrl, width: 800, quality: 85 });

  useScrollAnimation();

  useEffect(() => {
    loadGalleryImages();
  }, []);

  const loadGalleryImages = async () => {
    try {
      // Load from gallery_images table
      const { data, error } = await supabase
        .from('gallery_images')
        .select('url')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        const imageUrls = data.map(item => ({ url: item.url }));
        setImages(imageUrls);
      } else if (defaultImages.length > 0) {
        setImages(defaultImages);
      }
    } catch (error) {
      console.error('Error loading gallery images:', error);
      if (defaultImages.length > 0) {
        setImages(defaultImages);
      }
    } finally {
      setLoading(false);
    }
  };

  const addNewImages = async (newUrls: string[]) => {
    try {
      // Add images to database
      const imagesToInsert = newUrls.map((url, index) => ({
        url,
        filename: url.split('/').pop() || `image-${Date.now()}-${index}`,
        sort_order: images.length + index,
        is_active: true
      }));

      const { error } = await supabase
        .from('gallery_images')
        .insert(imagesToInsert);

      if (error) throw error;

      // Reload images from database
      await loadGalleryImages();
    } catch (error) {
      console.error('Error adding images to gallery:', error);
    }
  };

  const nextSlide = useCallback(() => {
    if (images.length === 0) return;
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  }, [images.length]);

  const prevSlide = useCallback(() => {
    if (images.length === 0) return;
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  }, [images.length]);

  // Reset currentIndex if it's out of bounds
  useEffect(() => {
    if (currentIndex >= images.length && images.length > 0) {
      setCurrentIndex(0);
    }
  }, [images.length, currentIndex]);
  useEffect(() => {
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <section id="gallery" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 scroll-animate fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-sage-800 mb-4 font-hebrew">
            גלריה
          </h2>
          <p className="text-lg text-sage-600 max-w-2xl mx-auto font-hebrew-light">
            הציצו לתוך עולם היוגה שלנו - רגעים מהסטודיו, מהתרגולים ומהקהילה המיוחדת שלנו
          </p>
        </div>

        <div className="relative mx-auto flex flex-col items-center w-full max-w-md scroll-animate fade-up">
          {/* Main Image Display */}
          <div className="relative aspect-[3/4] w-full max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl flex items-center justify-center bg-sage-100">
            {images.length > 0 && images[currentIndex] ? (
              <img
                src={optimizedUrl || images[currentIndex].url}
                alt={`Gallery image ${currentIndex + 1}`}
                className="max-h-full max-w-full object-contain transition-all duration-300"
                loading="eager"
                decoding="async"
                width="600"
                height="800"
              />
            ) : loading ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600"></div>
              </div>
            ) : null}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={nextSlide}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-300 z-10"
          >
            <ChevronLeft className="w-6 h-6 text-sage-600" />
          </button>

          <button
            onClick={prevSlide}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-300 z-10"
          >
            <ChevronRight className="w-6 h-6 text-sage-600" />
          </button>

         

          
        </div>
        
        {/* כפתור הוספת תמונות לאדמין */}
        <GalleryImageUploader onImagesAdded={addNewImages} />
      </div>
    </section>
  );
};

export default Gallery;