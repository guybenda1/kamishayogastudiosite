import React, { useState } from 'react';
import { ChevronDown, Check, Star } from 'lucide-react';

interface ProductVariant {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock_quantity: number;
  images?: { id: string; url: string; sort_order: number }[];
}

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariant: ProductVariant | null;
  onVariantChange: (variant: ProductVariant) => void;
  className?: string;
}

const VariantSelector: React.FC<VariantSelectorProps> = ({
  variants,
  selectedVariant,
  onVariantChange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (variants.length === 0) return null;

  return (
    <div className={`relative ${className}`}>
      <label className="block text-lg font-bold text-sage-800 mb-3 font-hebrew text-right">
        בחר דגם:
      </label>
      
      {/* Custom Dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-white border-2 border-sage-200 hover:border-sage-400 rounded-2xl p-4 text-right transition-all duration-300 shadow-sm hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <ChevronDown className={`w-5 h-5 text-sage-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              {selectedVariant && (
                <>
                  <div className="text-right">
                    <div className="font-bold text-sage-800 font-hebrew">
                      {selectedVariant.name}
                    </div>
                    <div className="text-sage-600 font-hebrew text-sm">
                      ₪{selectedVariant.price}
                    </div>
                  </div>
                  <img
                    src={selectedVariant.image_url}
                    alt={selectedVariant.name}
                    className="w-12 h-12 object-cover rounded-lg border border-sage-200"
                    loading="lazy"
                    decoding="async"
                  />
                </>
              )}
              {!selectedVariant && (
                <span className="text-gray-500 font-hebrew">בחר דגם...</span>
              )}
            </div>
          </div>
        </button>

        {/* Dropdown Options */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-sage-200 rounded-2xl shadow-xl z-50 overflow-hidden">
            <div className="max-h-80 overflow-y-auto">
              {variants.map((variant) => (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => {
                    onVariantChange(variant);
                    setIsOpen(false);
                  }}
                  className="w-full p-4 text-right hover:bg-sage-50 transition-colors border-b border-sage-100 last:border-b-0"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      {selectedVariant?.id === variant.id && (
                        <div className="w-6 h-6 bg-sage-600 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                      {variant.stock_quantity <= 5 && variant.stock_quantity > 0 && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-hebrew">
                          נותרו {variant.stock_quantity}
                        </span>
                      )}
                      {variant.stock_quantity === 0 && (
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-hebrew">
                          אזל
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                      <div className="text-right">
                        <div className="font-bold text-sage-800 font-hebrew text-lg">
                          {variant.name}
                        </div>
                        <div className="text-sage-600 font-hebrew text-sm mb-1">
                          ₪{variant.price}
                        </div>
                      </div>
                      <img
                        src={variant.image_url}
                        alt={variant.name}
                        className="w-16 h-16 object-cover rounded-lg border border-sage-200 shadow-sm"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Selected Variant Description */}
      {selectedVariant && selectedVariant.description && (
        <div className="mt-4 p-4 bg-sage-50 rounded-xl border border-sage-200">
          <h4 className="font-bold text-sage-800 font-hebrew mb-2">פרטי הדגם:</h4>
          <div
            className="text-black font-hebrew-light leading-relaxed"
            dangerouslySetInnerHTML={{ __html: selectedVariant.description }}
          />
        </div>
      )}
    </div>
  );
};

export default VariantSelector;