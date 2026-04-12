import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useOptimizedImage } from '../../hooks/useOptimizedImage';

interface ProductImage {
  id: string;
  url: string;
  sort_order: number;
}

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
  className?: string;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
  productName,
  className = ''
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { optimizedUrl } = useOptimizedImage({
    url: images[currentIndex]?.url || '',
    width: 800,
    quality: 85,
  });
  const { optimizedUrl: thumbUrl } = useOptimizedImage({
    url: images[currentIndex]?.url || '',
    width: 200,
    quality: 80,
  });

  if (images.length === 0) {
    return (
      <div className={`aspect-[9/16] max-w-sm mx-auto bg-gray-100 rounded-2xl flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-500 font-hebrew-light">אין תמונות זמינות</p>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Image */}
      <div className="relative aspect-[9/16] max-w-sm mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <img
          src={optimizedUrl || images[currentIndex]?.url}
          alt={`${productName} - תמונה ${currentIndex + 1}`}
          className="w-full h-full object-cover"
          loading="eager"
          decoding="async"
          width="800"
          height="1422"
        />
        
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-300"
            >
              <ChevronRight className="w-5 h-5 text-sage-600" />
            </button>
            <button
              onClick={nextImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-300"
            >
              <ChevronLeft className="w-5 h-5 text-sage-600" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-hebrew">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex justify-center space-x-2 rtl:space-x-reverse">
          {images.map((image, index) => (
            <ThumbnailImage
              key={image.id}
              image={image}
              index={index}
              isActive={index === currentIndex}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface ThumbnailImageProps {
  image: ProductImage;
  index: number;
  isActive: boolean;
  onClick: () => void;
}

const ThumbnailImage: React.FC<ThumbnailImageProps> = ({ image, index, isActive, onClick }) => {
  const { optimizedUrl } = useOptimizedImage({
    url: image.url,
    width: 100,
    quality: 75,
  });

  return (
    <button
      onClick={onClick}
      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
        isActive
          ? 'border-sage-600 ring-2 ring-sage-200'
          : 'border-gray-200 hover:border-sage-400'
      }`}
    >
      <img
        src={optimizedUrl || image.url}
        alt={`תמונה ${index + 1}`}
        className="w-full h-full object-cover"
        loading="eager"
        decoding="async"
        width="100"
        height="100"
      />
    </button>
  );
};

export default ProductImageGallery;