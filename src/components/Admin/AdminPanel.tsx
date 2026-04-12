import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Package, MessageSquare, GripVertical, ArrowUp, ArrowDown } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import ImageUploader from '../ImageUpload/ImageUploader';
import TestimonialsAdmin from './TestimonialsAdmin';
import SimpleTextEditor from '../RichTextEditor/SimpleTextEditor';
import toast from 'react-hot-toast';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

interface VariantImage {
  id: string;
  url: string;
  sort_order: number;
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
  sort_order: number;
  images?: VariantImage[];
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock_quantity: number;
  is_active: boolean;
  variants?: ProductVariant[];
}

const AdminPanel = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [variantImages, setVariantImages] = useState<{ [variantId: string]: VariantImage[] }>({});
  const [activeTab, setActiveTab] = useState<'products' | 'testimonials'>('products');
  const { user } = useAuthStore();

  useScrollAnimation();

  const categories = ['תכשיטים', 'ציוד יוגה', 'ספרים', 'בגדים'];

  const emptyProduct: Omit<Product, 'id'> = {
    name: '',
    description: '',
    price: 0,
    image_url: '',
    category: 'תכשיטים',
    stock_quantity: 0,
    is_active: true,
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchVariants = async (productId: string) => {
    try {
      const { data, error } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', productId)
        .order('sort_order');

      if (error) throw error;
      setVariants(data || []);
    } catch (error) {
      console.error('Error fetching variants:', error);
      setVariants([]);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('שגיאה בטעינת המוצרים');
    } finally {
      setLoading(false);
    }
  };

  const saveVariants = async (productId: string) => {
    try {
      // Delete existing variants
      const { error: deleteError } = await supabase
        .from('product_variants')
        .delete()
        .eq('product_id', productId);

      if (deleteError) {
        console.warn('Error deleting old variants:', deleteError);
      }

      // Insert new variants
      const variantsToSave = variants
        .filter(v => v.name.trim() !== '')
        .map(v => ({
          product_id: productId,
          name: v.name,
          description: v.description,
          price: v.price,
          image_url: v.image_url,
          stock_quantity: v.stock_quantity,
          is_active: v.is_active,
          sort_order: v.sort_order,
        }));

      if (variantsToSave.length > 0) {
        const { error } = await supabase
          .from('product_variants')
          .insert(variantsToSave);

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error saving variants:', error);
      toast.error('שגיאה בשמירת הוריאציות');
      throw error;
    }
  };

  const handleSaveProduct = async (productData: Omit<Product, 'id'> & { id?: string }) => {
    try {
      if (productData.id) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update({
            ...productData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', productData.id);

        if (error) throw error;
        
        // Save variants after updating product
        if (variants.length > 0) {
          await saveVariants(productData.id);
        }
        toast.success('המוצר עודכן בהצלחה');
      } else {
        // Create new product
        const { data, error } = await supabase
          .from('products')
          .insert([productData])
          .select()
          .single();

        if (error) throw error;
        
        // Save variants for new product
        if (data && variants.length > 0) {
          await saveVariants(data.id);
        }
        toast.success('המוצר נוסף בהצלחה');
      }

      setEditingProduct(null);
      setIsAddingNew(false);
      setVariants([]);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('שגיאה בשמירת המוצר');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק את המוצר?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('המוצר נמחק בהצלחה');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('שגיאה במחיקת המוצר');
    }
  };

  const handleEditProduct = async (product: Product) => {
    setEditingProduct(product);
    setVariants([]); // Reset variants first
    if (product.id) {
      await fetchVariants(product.id);
    }
  };

  // Check if user is admin
  const isAdmin = user?.email === 'limorbendavid29@gmail.com' || user?.email === 'admin@kamisha.com';

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4 font-hebrew">אין הרשאה</h2>
          <p className="text-gray-600 font-hebrew mb-4">אין לך הרשאה לגשת לעמוד זה</p>
          <div className="bg-gray-100 p-4 rounded-lg text-right">
            <h3 className="font-bold text-sage-800 mb-2 font-hebrew">כניסה למערכת הניהול:</h3>
            <p className="text-sm text-gray-600 font-hebrew-light mb-2">
              <strong>כתובת:</strong> /admin
            </p>
            <p className="text-sm text-gray-600 font-hebrew-light mb-2">
              <strong>אימייל מורשה:</strong> limorbendavid29@gmail.com
            </p>
            <p className="text-sm text-gray-600 font-hebrew-light">
              יש להתחבר עם החשבון המורשה כדי לגשת לפאנל הניהול
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600 mx-auto mb-4"></div>
          <p className="text-sage-600 font-hebrew">טוען...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-warm-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 scroll-animate fade-up">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-sage-800 font-hebrew mb-4">
              ⚙️ פאנל ניהול
            </h1>
            <p className="text-sage-600 font-hebrew-light text-lg">
              ניהול מוצרים, ביקורות ותוכן האתר
            </p>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex justify-center space-x-4 rtl:space-x-reverse mb-8">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-6 py-3 rounded-xl font-hebrew font-bold transition-all flex items-center space-x-2 rtl:space-x-reverse ${
                activeTab === 'products'
                  ? 'bg-sage-600 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Package className="w-5 h-5" />
              <span>ניהול מוצרים</span>
            </button>
            <button
              onClick={() => setActiveTab('testimonials')}
              className={`px-6 py-3 rounded-xl font-hebrew font-bold transition-all flex items-center space-x-2 rtl:space-x-reverse ${
                activeTab === 'testimonials'
                  ? 'bg-warm-600 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              <span>ניהול ביקורות</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'products' && (
          <>
            {/* Products Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 scroll-animate fade-up">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-sage-800 font-hebrew mb-2">
                  🛍️ ניהול החנות
                </h2>
                <p className="text-sage-600 font-hebrew-light">
                  ניהול מוצרים, דגמים ומלאי של הסטודיו
                </p>
              </div>
              
              <div className="flex justify-center mb-8">
                <button
                  onClick={() => setIsAddingNew(true)}
                  className="bg-gradient-to-r from-sage-600 to-sage-700 hover:from-sage-700 hover:to-sage-800 text-white px-8 py-4 rounded-2xl font-hebrew font-bold text-lg flex items-center space-x-3 rtl:space-x-reverse shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  <Plus className="w-6 h-6" />
                  <span>➕ הוסף מוצר חדש</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl text-center">
                  <div className="text-3xl font-bold text-blue-600 font-hebrew">
                    {products.length}
                  </div>
                  <div className="text-blue-800 font-hebrew font-medium">מוצרים פעילים</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl text-center">
                  <div className="text-3xl font-bold text-green-600 font-hebrew">
                    {products.reduce((sum, p) => sum + p.stock_quantity, 0)}
                  </div>
                  <div className="text-green-800 font-hebrew font-medium">יחידות במלאי</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl text-center">
                  <div className="text-3xl font-bold text-purple-600 font-hebrew">
                    {categories.length}
                  </div>
                  <div className="text-purple-800 font-hebrew font-medium">קטגוריות</div>
                </div>
              </div>
            </div>

            {/* Add/Edit Product Form */}
            {(isAddingNew || editingProduct) && (
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 scroll-animate fade-up">
                <ProductForm
                  product={editingProduct || emptyProduct}
                  categories={categories}
                  variants={variants}
                  onVariantsChange={setVariants}
                  variantImages={variantImages}
                  onVariantImagesChange={setVariantImages}
                  onSave={handleSaveProduct}
                  onCancel={() => {
                    setIsAddingNew(false);
                    setEditingProduct(null);
                    setVariants([]);
                    setVariantImages({});
                  }}
                />
              </div>
            )}

            {/* Products Table */}
           <div className="bg-white rounded-2xl shadow-lg overflow-hidden scroll-animate fade-up">
              <div className="bg-gradient-to-r from-sage-600 to-sage-700 p-6">
                <h2 className="text-2xl font-bold text-white font-hebrew text-center">
                  📋 רשימת המוצרים
                </h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-right text-sm font-bold text-sage-800 font-hebrew">
                        פעולות
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-sage-800 font-hebrew">
                        מלאי
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-sage-800 font-hebrew">
                        מחיר
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-sage-800 font-hebrew">
                        קטגוריה
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-sage-800 font-hebrew">
                        שם המוצר
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-sage-800 font-hebrew">
                        תמונה
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-sage-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2 rtl:space-x-reverse">
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-colors"
                              title="ערוך מוצר"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
                              title="מחק מוצר"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <span className={`px-3 py-1 rounded-full text-sm font-hebrew font-medium ${
                            product.stock_quantity > 10 
                              ? 'bg-green-100 text-green-800' 
                              : product.stock_quantity > 0 
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }`}>
                            {product.stock_quantity}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-sage-800 text-right font-hebrew">
                          ₪{product.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-hebrew">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right font-hebrew">
                          {product.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-xl shadow-md"
                            loading="lazy"
                            decoding="async"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Testimonials Tab */}
        {activeTab === 'testimonials' && (
          <TestimonialsAdmin />
        )}
      </div>
    </div>
  );
};

interface ProductFormProps {
  product: Omit<Product, 'id'> & { id?: string };
  categories: string[];
  variants: ProductVariant[];
  onVariantsChange: (variants: ProductVariant[]) => void;
  variantImages: { [variantId: string]: VariantImage[] };
  onVariantImagesChange: (images: { [variantId: string]: VariantImage[] }) => void;
  onSave: (product: Omit<Product, 'id'> & { id?: string }) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ 
  product, 
  categories, 
  variants, 
  onVariantsChange, 
  variantImages,
  onVariantImagesChange,
  onSave, 
  onCancel 
}) => {
  const [formData, setFormData] = useState(product);
  const [showVariants, setShowVariants] = useState(false);

  // Update formData when product changes (for editing)
  useEffect(() => {
    setFormData(product);
  }, [product]);

  // Load variant images when variants change
  useEffect(() => {
    if (variants.length > 0) {
      loadVariantImages();
    }
  }, [variants]);

  const loadVariantImages = async () => {
    try {
      const imagePromises = variants.map(async (variant) => {
        if (!variant.id || variant.id.startsWith('temp-')) {
          return { variantId: variant.id, images: [] };
        }

        const { data, error } = await supabase
          .from('product_variant_images')
          .select('*')
          .eq('variant_id', variant.id)
          .eq('is_active', true)
          .order('sort_order');

        if (error) {
          console.error('Error loading variant images:', error);
          return { variantId: variant.id, images: [] };
        }

        return {
          variantId: variant.id,
          images: data || []
        };
      });

      const results = await Promise.all(imagePromises);
      const imageMap: { [variantId: string]: VariantImage[] } = {};
      
      results.forEach(({ variantId, images }) => {
        imageMap[variantId] = images.map(img => ({
          id: img.id,
          url: img.image_url,
          sort_order: img.sort_order
        }));
      });

      onVariantImagesChange(imageMap);
    } catch (error) {
      console.error('Error loading variant images:', error);
    }
  };

  const updateVariantImages = (variantId: string, images: VariantImage[]) => {
    onVariantImagesChange({
      ...variantImages,
      [variantId]: images
    });
  };

  const addVariant = () => {
    const newVariant: ProductVariant = {
      id: `temp-${Date.now()}`,
      product_id: product.id || '',
      name: '',
      description: '',
      price: formData.price,
      image_url: '',
      stock_quantity: 0,
      is_active: true,
      sort_order: variants.length,
    };
    onVariantsChange([...variants, newVariant]);
  };

  const updateVariant = (index: number, field: keyof ProductVariant, value: any) => {
    const updatedVariants = [...variants];
    updatedVariants[index] = { ...updatedVariants[index], [field]: value };
    onVariantsChange(updatedVariants);
  };

  const removeVariant = (index: number) => {
    const variantToRemove = variants[index];
    const updatedVariants = variants.filter((_, i) => i !== index);
    
    // Remove images for this variant
    const updatedImages = { ...variantImages };
    delete updatedImages[variantToRemove.id];
    onVariantImagesChange(updatedImages);
    
    onVariantsChange(updatedVariants);
  };

  const moveVariant = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= variants.length) return;
    
    const updatedVariants = [...variants];
    const [movedVariant] = updatedVariants.splice(index, 1);
    updatedVariants.splice(newIndex, 0, movedVariant);
    
    // Update sort_order for all variants
    updatedVariants.forEach((variant, idx) => {
      variant.sort_order = idx;
    });
    
    onVariantsChange(updatedVariants);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleMainImageUpload = (url: string) => {
    setFormData({ ...formData, image_url: url });
  };

  const handleVariantMainImageUpload = (index: number, url: string) => {
    updateVariant(index, 'image_url', url);
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-sage-800 mb-2 font-hebrew">
          {product.id ? 'עריכת מוצר' : 'הוספת מוצר חדש'}
        </h2>
        <p className="text-sage-600 font-hebrew-light">
          {product.id ? 'ערוך את פרטי המוצר' : 'הוסף מוצר חדש לחנות'}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-base font-bold text-sage-800 mb-3 font-hebrew text-right">
              שם המוצר
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-sage-500 text-right font-hebrew transition-all"
              placeholder="הכנס שם המוצר"
              required
            />
          </div>

          <div>
            <label className="block text-base font-bold text-sage-800 mb-3 font-hebrew text-right">
              קטגוריה
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-sage-500 text-right font-hebrew transition-all"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-base font-bold text-sage-800 mb-3 font-hebrew text-right">
              מחיר
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-sage-500 text-right font-hebrew transition-all"
              placeholder="0"
              required
            />
          </div>

          <div>
            <label className="block text-base font-bold text-sage-800 mb-3 font-hebrew text-right">
              כמות במלאי
            </label>
            <input
              type="number"
              value={formData.stock_quantity}
              onChange={(e) => setFormData({ ...formData, stock_quantity: Number(e.target.value) })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-sage-500 text-right font-hebrew transition-all"
              placeholder="0"
              required
            />
          </div>
        </div>

        {/* Product Description with Simple Text Editor */}
        <div>
          <label className="block text-base font-bold text-sage-800 mb-3 font-hebrew text-right">
            תיאור המוצר
          </label>
          <SimpleTextEditor
            value={formData.description}
            onChange={(value) => setFormData({ ...formData, description: value })}
            placeholder="תיאור המוצר..."
          />
        </div>

        {/* Main Product Image */}
        <div className="bg-gradient-to-br from-sage-50 to-sage-100 p-6 rounded-2xl border-2 border-sage-200">
          <label className="block text-xl font-bold text-sage-800 mb-4 font-hebrew text-right">
            🖼️ תמונת המוצר הראשית
          </label>
          
          {formData.image_url && (
            <div className="mb-6">
              <div className="relative inline-block">
                <img
                  src={formData.image_url}
                  alt="תמונת המוצר הנוכחית"
                  className="w-48 h-48 object-cover rounded-xl border-2 border-sage-300 shadow-lg"
                  loading="lazy"
                  decoding="async"
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, image_url: '' })}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors shadow-lg"
                  title="הסר תמונה"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-sage-600 font-hebrew-light mt-2 text-center">
                תמונת המוצר הנוכחית
              </p>
            </div>
          )}
          
          <ImageUploader
            currentImage={formData.image_url}
            onImageUploaded={handleMainImageUpload}
            folder="products"
            buttonText={formData.image_url ? "🔄 החלף תמונת מוצר" : "📤 העלה תמונת מוצר"}
            className="max-w-md mx-auto"
          />
        </div>

        {/* Variants Section */}
        <div className="bg-gradient-to-br from-warm-50 to-warm-100 p-6 rounded-2xl border-2 border-warm-200">
          <div className="flex justify-between items-center mb-6">
            <button
              type="button"
              onClick={() => setShowVariants(!showVariants)}
              className="px-6 py-3 bg-warm-600 hover:bg-warm-700 text-white rounded-xl font-hebrew font-bold transition-colors shadow-lg"
            >
              {showVariants ? '🔽 הסתר וריאציות' : '🔼 הצג וריאציות'}
            </button>
            <h3 className="text-xl font-bold text-warm-800 font-hebrew">🎨 וריאציות המוצר</h3>
          </div>
          
          {showVariants && (
            <div className="space-y-6">
              <button
                type="button"
                onClick={addVariant}
                className="w-full px-6 py-4 border-2 border-dashed border-warm-400 rounded-xl text-warm-700 hover:bg-warm-100 transition-colors font-hebrew font-bold text-lg flex items-center justify-center space-x-3 rtl:space-x-reverse"
              >
                <Plus className="w-6 h-6" />
                <span>➕ הוסף וריאציה חדשה</span>
              </button>
              
              {variants.map((variant, index) => (
                <div key={variant.id} className="bg-white p-6 rounded-2xl border-2 border-warm-300 shadow-md">
                  <div className="flex justify-between items-center mb-6">
                    {/* Sorting Controls */}
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <button
                        type="button"
                        onClick={() => moveVariant(index, 'up')}
                        disabled={index === 0}
                        className="p-2 bg-blue-100 hover:bg-blue-200 disabled:bg-gray-100 disabled:text-gray-400 text-blue-600 rounded-lg transition-colors"
                        title="הזז למעלה"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveVariant(index, 'down')}
                        disabled={index === variants.length - 1}
                        className="p-2 bg-blue-100 hover:bg-blue-200 disabled:bg-gray-100 disabled:text-gray-400 text-blue-600 rounded-lg transition-colors"
                        title="הזז למטה"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse text-gray-500">
                        <GripVertical className="w-4 h-4" />
                        <span className="text-sm font-hebrew">#{index + 1}</span>
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
                      title="מחק וריאציה"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    
                    <div className="text-center">
                      <h4 className="font-bold text-warm-800 font-hebrew text-lg">
                        🎯 וריאציה {index + 1}
                      </h4>
                      <p className="text-sm text-warm-600 font-hebrew-light">
                        סדר הצגה: {variant.sort_order}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 font-hebrew text-right">
                        שם הוריאציה
                      </label>
                      <input
                        type="text"
                        value={variant.name}
                        onChange={(e) => updateVariant(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-warm-500 focus:border-transparent text-right font-hebrew"
                        placeholder="דגם קלאסי, דגם מתקדם..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 font-hebrew text-right">
                        מחיר
                      </label>
                      <input
                        type="number"
                        value={variant.price}
                        onChange={(e) => updateVariant(index, 'price', Number(e.target.value))}
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-warm-500 focus:border-transparent text-right font-hebrew"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 font-hebrew text-right">
                        כמות במלאי
                      </label>
                      <input
                        type="number"
                        value={variant.stock_quantity}
                        onChange={(e) => updateVariant(index, 'stock_quantity', Number(e.target.value))}
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-warm-500 focus:border-transparent text-right font-hebrew"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 font-hebrew text-right">
                        סדר הצגה
                      </label>
                      <input
                        type="number"
                        value={variant.sort_order}
                        onChange={(e) => updateVariant(index, 'sort_order', Number(e.target.value))}
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-warm-500 focus:border-transparent text-right font-hebrew bg-blue-50"
                        min="0"
                        step="1"
                      />
                    </div>
                  </div>
                  
                  {/* Variant Description with Simple Text Editor */}
                  <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-700 mb-2 font-hebrew text-right">
                      תיאור הוריאציה
                    </label>
                    <SimpleTextEditor
                      value={variant.description}
                      onChange={(value) => updateVariant(index, 'description', value)}
                      placeholder="תיאור מפורט של הוריאציה..."
                    />
                  </div>
                  
                  {/* Variant Main Image Upload */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200 mb-4">
                    <label className="block text-sm font-bold text-blue-800 mb-3 font-hebrew text-right">
                      🖼️ תמונת הוריאציה הראשית
                    </label>
                    
                    {variant.image_url && (
                      <div className="mb-4">
                        <div className="relative inline-block">
                          <img
                            src={variant.image_url}
                            alt={`תמונת וריאציה ${index + 1}`}
                            className="w-32 h-32 object-cover rounded-lg border-2 border-blue-300 shadow-md"
                            loading="lazy"
                            decoding="async"
                          />
                          <button
                            type="button"
                            onClick={() => updateVariant(index, 'image_url', '')}
                            className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors shadow-md"
                            title="הסר תמונה"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}
                    
                    <ImageUploader
                      currentImage={variant.image_url}
                      onImageUploaded={(url) => handleVariantMainImageUpload(index, url)}
                      folder="product-variants"
                      buttonText={variant.image_url ? "🔄 החלף תמונת וריאציה" : "📤 העלה תמונת וריאציה"}
                      className="max-w-sm mx-auto"
                    />
                  </div>
                  
                  {/* Variant Images Manager */}
                  <VariantImageManager
                    variantId={variant.id}
                    images={variantImages[variant.id] || []}
                    onImagesChange={(images) => updateVariantImages(variant.id, images)}
                  />
                  
                  <div className="flex items-center justify-center mt-4 p-3 bg-gray-50 rounded-lg">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={variant.is_active}
                        onChange={(e) => updateVariant(index, 'is_active', e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-warm-600 focus:ring-warm-500"
                      />
                      <span className="mr-2 text-sm font-bold text-gray-700 font-hebrew">✅ וריאציה פעילה</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-center p-4 bg-sage-50 rounded-xl">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-5 h-5 rounded border-gray-300 text-sage-600 focus:ring-sage-500"
            />
            <span className="mr-3 text-base font-medium text-sage-800 font-hebrew">✅ מוצר פעיל</span>
          </label>
        </div>

        <div className="flex justify-center space-x-4 rtl:space-x-reverse pt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-8 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-hebrew font-medium transition-all flex items-center space-x-2 rtl:space-x-reverse"
          >
            <X className="w-5 h-5" />
            <span>❌ ביטול</span>
          </button>
          <button
            type="submit"
            className="px-8 py-3 bg-gradient-to-r from-sage-600 to-sage-700 hover:from-sage-700 hover:to-sage-800 text-white rounded-xl font-hebrew font-bold transition-all flex items-center space-x-2 rtl:space-x-reverse shadow-lg"
          >
            <Save className="w-5 h-5" />
            <span>💾 שמור מוצר</span>
          </button>
        </div>
      </form>
    </div>
  );
};

// Variant Image Manager Component
interface VariantImageManagerProps {
  variantId: string;
  images: VariantImage[];
  onImagesChange: (images: VariantImage[]) => void;
}

const VariantImageManager: React.FC<VariantImageManagerProps> = ({
  variantId,
  images,
  onImagesChange
}) => {
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
    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-bold text-purple-800 font-hebrew">
          🖼️ תמונות הוריאציה ({images.length})
        </h4>
      </div>

      {/* Current Images */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          {images.map((image, index) => (
            <div key={image.id} className="relative group">
              <img
                src={image.url}
                alt={`תמונה ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border-2 border-purple-200"
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
              <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                #{index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add New Image */}
      <div className="border-2 border-dashed border-purple-300 rounded-lg p-4">
        <ImageUploader
          onImageUploaded={addImage}
          folder={`product-variants/${variantId}`}
          buttonText="➕ הוסף תמונה לוריאציה"
          className="max-w-sm mx-auto"
        />
      </div>

      {images.length === 0 && (
        <div className="text-center py-8 bg-purple-50 rounded-lg border border-purple-200">
          <div className="w-12 h-12 text-purple-400 mx-auto mb-3">📸</div>
          <p className="text-purple-600 font-hebrew-light">
            עדיין לא הועלו תמונות לוריאציה זו
          </p>
          <p className="text-sm text-purple-500 font-hebrew-light mt-1">
            השתמש בכפתור למעלה כדי להוסיף תמונות
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;