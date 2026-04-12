import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, ShoppingCart, Star, Check } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import useCartStore from '../../store/cartStore';
import VariantSelector from './VariantSelector';
import ProductImageGallery from './ProductImageGallery';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock_quantity: number;
  is_active: boolean;
  images?: { id: string; url: string; sort_order: number }[];
  variants?: ProductVariant[];
}

interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock_quantity: number;
  is_active: boolean;
  images?: { id: string; url: string; sort_order: number }[];
}

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();


  // Mock data for demonstration - in real app this would come from database
  const mockProducts: Record<string, Product> = {
    '1': {
      id: '1',
      name: 'צמיד מדיטציה',
      description: 'צמיד עשוי אבנים טבעיות לחיזוק המיקוד והשלווה. כל צמיד נוצר בקפידה מאבנים נבחרות המסייעות לריכוז ולהעמקת התרגול.',
      price: 180,
      image_url: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
      category: 'תכשיטים',
      stock_quantity: 10,
      is_active: true,
      variants: [
        {
          id: '1a',
          name: 'דגם קלאסי - מתאים למתחילים',
          description: 'צמיד בסיסי עם אבני אמטיסט ורוז קוורץ',
          price: 180,
          image_url: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
          stock_quantity: 15
        },
        {
          id: '1b',
          name: 'דגם מתקדם - גרסה מתקדמת',
          description: 'צמיד עם אבני לאפיס לזולי וטייגר איי',
          price: 220,
          image_url: 'https://images.pexels.com/photos/1191710/pexels-photo-1191710.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
          stock_quantity: 8
        },
        {
          id: '1c',
          name: 'דגם פרימיום - עיצוב חדשני',
          description: 'צמיד מעוצב עם אבני חן נדירות וחריטות מיוחדות',
          price: 280,
          image_url: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
          stock_quantity: 5
        }
      ]
    },
    '2': {
      id: '2',
      name: 'שרשרת צ\'אקרות',
      description: 'שרשרת מיוחדת לאיזון האנרגיות עם אבני חן טבעיות המייצגות את שבעת הצ\'אקרות.',
      price: 320,
      image_url: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
      category: 'תכשיטים',
      stock_quantity: 5,
      is_active: true,
      variants: [
        {
          id: '2a',
          name: 'דגם בסיסי - מתאים למתחילים',
          description: 'שרשרת עם 7 אבנים בסיסיות לצ\'אקרות',
          price: 320,
          image_url: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
          stock_quantity: 10
        },
        {
          id: '2b',
          name: 'דגם מקצועי - גרסה מתקדמת',
          description: 'שרשרת עם אבנים איכותיות וחריטות צ\'אקרות',
          price: 420,
          image_url: 'https://images.pexels.com/photos/1191710/pexels-photo-1191710.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
          stock_quantity: 6
        }
      ]
    },
    '3': {
      id: '3',
      name: 'מחצלת יוגה פרימיום',
      description: 'מחצלת יוגה איכותית עם אחיזה מעולה ועמידות לאורך זמן. עשויה מחומרים ידידותיים לסביבה.',
      price: 250,
      image_url: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
      category: 'ציוד יוגה',
      stock_quantity: 15,
      is_active: true,
      variants: [
        {
          id: '3a',
          name: 'דגם סטנדרטי - מתאים למתחילים',
          description: 'מחצלת בעובי 4 מ"מ, מתאימה לתרגול בסיסי',
          price: 250,
          image_url: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
          stock_quantity: 20
        },
        {
          id: '3b',
          name: 'דגם פרו - גרסה מתקדמת',
          description: 'מחצלת בעובי 6 מ"מ עם סימוני יישור',
          price: 320,
          image_url: 'https://images.pexels.com/photos/1191710/pexels-photo-1191710.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
          stock_quantity: 12
        },
        {
          id: '3c',
          name: 'דגם אקולוגי - עיצוב חדשני',
          description: 'מחצלת מחומרים טבעיים 100% עם עיצוב ייחודי',
          price: 380,
          image_url: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
          stock_quantity: 8
        }
      ]
    }
  };

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  const fetchProduct = async (productId: string) => {
    try {
      // Fetch product from Supabase
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .eq('is_active', true)
        .single();

      if (productError) {
        // Fallback to mock data if Supabase fails
        const mockProduct = mockProducts[productId];
        if (mockProduct) {
          setProduct(mockProduct);
          setVariants(mockProduct.variants || []);
          if (mockProduct.variants && mockProduct.variants.length > 0) {
            setSelectedVariant(mockProduct.variants[0]);
          }
        } else {
          toast.error('המוצר לא נמצא');
          navigate('/store');
        }
      } else {
        setProduct(productData);
        
        // Fetch variants
        const { data: variantsData } = await supabase
          .from('product_variants')
          .select('*')
          .eq('product_id', productId)
          .eq('is_active', true)
          .order('sort_order');

        if (variantsData && variantsData.length > 0) {
          setVariants(variantsData);
          setSelectedVariant(variantsData[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('שגיאה בטעינת המוצר');
    } finally {
      setLoading(false);
    }
  };

  const handleVariantChange = (variantId: string) => {
    if (variants.length > 0) {
      const variant = variants.find(v => v.id === variantId);
      if (variant) {
        setSelectedVariant(variant);
      }
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    // בדיקה חובה - אם יש וריאציות, חייב לבחור אחת
    if (variants.length > 0) {
      if (!selectedVariant) {
        toast.error('חובה לבחור דגם לפני הוספה לסל');
        return;
      }
    }

    const itemToAdd = selectedVariant ? {
      id: selectedVariant.id,
      name: `${product.name} - ${selectedVariant.name}`,
      price: selectedVariant.price,
      image_url: selectedVariant.image_url,
    } : {
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
    };

    for (let i = 0; i < quantity; i++) {
      addItem(itemToAdd);
    }
    
    toast.success(`${quantity} פריטים נוספו לסל!`);
  };

  const getCurrentPrice = () => {
    return selectedVariant ? selectedVariant.price : product?.price || 0;
  };

  const getCurrentImage = () => {
    return selectedVariant ? selectedVariant.image_url : product?.image_url || '';
  };

  const getCurrentStock = () => {
    return selectedVariant ? selectedVariant.stock_quantity : product?.stock_quantity || 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600 mx-auto mb-4"></div>
          <p className="text-sage-600 font-hebrew">טוען מוצר...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <p className="text-gray-600 font-hebrew text-lg">המוצר לא נמצא</p>
          <button
            onClick={() => navigate('/store')}
            className="mt-4 text-sage-600 hover:text-sage-800 font-hebrew underline"
          >
            חזור לחנות
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 rtl:space-x-reverse mb-8 text-sm">
          <button
            onClick={() => navigate('/store')}
            className="text-sage-600 hover:text-sage-800 font-hebrew"
          >
            חנות
          </button>
          <ArrowRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600 font-hebrew">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <ProductImageGallery
              images={selectedVariant?.images?.map(img => ({
                id: img.id,
                url: img.url,
                sort_order: img.sort_order
              })) || [{ id: 'main', url: getCurrentImage(), sort_order: 0 }]}
              productName={product.name}
            />
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-sage-800 mb-2 font-hebrew">
                {product.name}
              </h1>
              <div className="flex items-center space-x-2 rtl:space-x-reverse mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
              
            </div>

            <p className="text-gray-700 font-hebrew-light leading-relaxed">
              <div dangerouslySetInnerHTML={{ __html: product.description }} />
            </p>

            {/* Variant Selection */}
            {variants.length > 0 && (
              <div>
                <VariantSelector
                variants={variants}
                selectedVariant={selectedVariant}
                onVariantChange={(variant) => setSelectedVariant(variant)}
                />
              </div>
            )}

            {/* Price */}
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <span className="text-3xl font-bold text-sage-800 font-hebrew">
                ₪{getCurrentPrice()}
              </span>
              {getCurrentStock() <= 5 && (
                <span className="text-red-600 text-sm font-hebrew">
                  נותרו רק {getCurrentStock()} יחידות
                </span>
              )}
            </div>

            {/* Quantity Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-hebrew">
                כמות:
              </label>
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  -
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(getCurrentStock(), quantity + 1))}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={getCurrentStock() === 0 || (variants.length > 0 && !selectedVariant && user)}
              className={`w-full py-4 rounded-lg font-hebrew font-medium transition-colors duration-300 flex items-center justify-center space-x-2 rtl:space-x-reverse ${
                getCurrentStock() === 0 
                  ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                  : (variants.length > 0 && !selectedVariant)
                      ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                      : 'bg-sage-600 hover:bg-sage-700 text-white'
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              <span>
                {getCurrentStock() === 0 
                  ? 'אזל מהמלאי' 
                  : (variants.length > 0 && !selectedVariant)
                    ? 'חובה לבחור דגם'
                    : 'הוסף לסל'
                }
              </span>
            </button>

            {/* Product Features */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-bold text-sage-800 mb-4 font-hebrew">
                מאפיינים
              </h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700 font-hebrew-light">מיוצר בישראל</span>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700 font-hebrew-light">משלוח חינם מעל ₪200</span>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700 font-hebrew-light">שנתיים אחריות על הצבע בלבד</span>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700 font-hebrew-light">החזרה תוך 30 יום</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
