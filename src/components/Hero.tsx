import React, { useEffect, useRef } from 'react';
import { useAuthStore } from '../store/authStore';
import ImageUploader from './ImageUpload/ImageUploader';
import { useSiteImage } from '../hooks/useSiteImage';
import { useOptimizedImage } from '../hooks/useOptimizedImage';

const Hero = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.email === 'limorbendavid29@gmail.com' || user?.email === 'admin@kamisha.com';
  const [isEditingImage, setIsEditingImage] = React.useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  const { imageUrl, updateImage } = useSiteImage(
    'hero',
    'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop'
  );

  const { optimizedUrl } = useOptimizedImage({
    url: imageUrl || '',
    width: 1920,
    quality: 75
  });

  useEffect(() => {
    if (!imageRef.current) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src && !img.src) {
              img.src = img.dataset.src;
              observer.unobserve(img);
            }
          }
        });
      },
      { rootMargin: '50px' }
    );

    observer.observe(imageRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-sage-900">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        {imageUrl && (
          <img
            ref={imageRef}
            src={optimizedUrl || imageUrl}
            alt="Kamisha Yoga Studio Background"
            className="absolute top-0 left-0 w-full h-full object-cover"
            loading="eager"
            decoding="async"
            width="1920"
            height="1080"
          />
        )}
        
        {/* Admin Edit Button */}
        {isAdmin && (
          <button
            onClick={() => setIsEditingImage(true)}
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors z-20"
            title="עדכן תמונת רקע"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-sage-900/30 to-warm-900/30">
          {/* Admin Edit Button for Overlay */}
          {isAdmin && (
            <button
              onClick={() => setIsEditingImage(true)}
              className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors z-20"
              title="עדכן תמונת רקע"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto safe-area-inset">
        <h1 className="hero-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-4 font-script leading-tight tracking-wide drop-shadow-2xl">
          Kamisha
        </h1>
        
        <h2 className="hero-subtitle text-xl sm:text-2xl md:text-3xl lg:text-4xl text-warm-200 mb-8 sm:mb-12 font-script italic drop-shadow-lg">
          Boutique Yoga Studio
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="#classes"
            className="w-full sm:w-auto bg-sage-600/90 hover:bg-sage-700 backdrop-blur-sm text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-hebrew font-medium transition-all duration-300 transform hover:scale-105 shadow-2xl border border-white/20 text-center"
          >
            רישום לתרגולים
          </a>
          {/* Store button - Hidden for now */}
          {/* <a
            href="/store"
            className="w-full sm:w-auto border-2 border-white/80 text-white hover:bg-white/20 backdrop-blur-sm px-6 sm:px-8 py-3 sm:py-4 rounded-full font-hebrew font-medium transition-all duration-300 shadow-xl text-center"
          >
            לחנות הסטודיו
          </a> */}
        </div>
      </div>
      
      {/* מודל עריכת תמונה */}
      {isEditingImage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setIsEditingImage(false)}
              className="absolute top-4 left-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-sage-800 font-hebrew">
                עדכן תמונת רקע ראשית
              </h2>
              <p className="text-gray-600 font-hebrew-light mt-2">
                התמונה תוחלף מיידית לאחר השמירה
              </p>
            </div>

            <ImageUploader
              onImageUploaded={(url) => {
                updateImage(url);
                setIsEditingImage(false);
              }}
              folder="hero"
              buttonText="העלה תמונת רקע חדשה"
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;