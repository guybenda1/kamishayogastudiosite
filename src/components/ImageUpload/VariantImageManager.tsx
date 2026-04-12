import React, { useState } from 'react';
import { Plus, X, ArrowUp, ArrowDown, Image as ImageIcon } from 'lucide-react';
import ImageUploader from './ImageUploader';

interface VariantImage {
  id: string;
  url: string;
  sort_order: number;
}

interface VariantImageManagerProps {
  variantId: string;
  images: VariantImage[];
  onImagesChange: (images: VariantImage[]) => void;
  className?: string;
}

const VariantImageManager: React.FC<VariantImageManagerProps> = ({
  variantId,
  images,
  onImagesChange,
  className = ''
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const addImage = (url: string) => {
    const newImage: VariantImage = {
      id: `temp-${Date.now()}`,
      url,
      sort_order: images.length
    };
    onImagesChange([...images, newImage]);
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    // Update sort_order for remaining images
    updatedImages.forEach((img, i) => {
      img.sort_order = i;
    });
    onImagesChange(updatedImages);
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= images.length) return;

    const updatedImages = [...images];
    const [movedImage] = updatedImages.splice(index, 1);
    updatedImages.splice(newIndex, 0, movedImage);
    
    // Update sort_order for all images
    updatedImages.forEach((img, i) => {
      img.sort_order = i;
    });
    
    onImagesChange(updatedImages);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-bold text-warm-800 font-hebrew">
          🖼️ תמונות הוריאציה ({images.length})
        </h4>
      </div>

      {/* Current Images */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={image.id} className="relative group">
              <img
                src={image.url}
                alt={`תמונה ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border-2 border-warm-200"
                loading="lazy"
                decoding="async"
              />
              
              {/* Image Controls */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <div className="flex space-x-2 rtl:space-x-reverse">
                  <button
                    type="button"
                    onClick={() => moveImage(index, 'up')}
                    disabled={index === 0}
                    className="p-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded"
                    title="הזז למעלה"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveImage(index, 'down')}
                    disabled={index === images.length - 1}
                    className="p-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded"
                    title="הזז למטה"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="p-1 bg-red-500 hover:bg-red-600 text-white rounded"
                    title="הסר תמונה"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Sort Order Badge */}
              <div className="absolute top-2 right-2 bg-warm-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                #{index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add New Image */}
      <div className="border-2 border-dashed border-warm-300 rounded-lg p-4">
        <ImageUploader
          onImageUploaded={addImage}
          folder={`product-variants/${variantId}`}
          buttonText="➕ הוסף תמונה לוריאציה"
          className="max-w-sm mx-auto"
        />
      </div>

      {images.length === 0 && (
        <div className="text-center py-8 bg-warm-50 rounded-lg border border-warm-200">
          <ImageIcon className="w-12 h-12 text-warm-400 mx-auto mb-3" />
          <p className="text-warm-600 font-hebrew-light">
            עדיין לא הועלו תמונות לוריאציה זו
          </p>
          <p className="text-sm text-warm-500 font-hebrew-light mt-1">
            השתמש בכפתור למעלה כדי להוסיף תמונות
          </p>
        </div>
      )}
    </div>
  );
};

export default VariantImageManager;