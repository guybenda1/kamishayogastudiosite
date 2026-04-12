import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
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
}

const StorePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');


  const categories = [
    { value: 'all', label: 'כל המוצרים' },
    { value: 'תכשיטים', label: 'תכשיטים' },
    { value: 'ציוד יוגה', label: 'ציוד יוגה' },
    { value: 'ספרים', label: 'ספרים' },
    { value: 'בגדים', label: 'בגדים' },
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('שגיאה בטעינת המוצרים - משתמש בנתונים לדוגמה');
      // Fallback to mock data
      setProducts([
        {
          id: '1',
          name: 'צמיד מדיטציה',
          description: 'צמיד עשוי אבנים טבעיות לחיזוק המיקוד והשלווה',
          price: 180,
          image_url: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
          category: 'תכשיטים',
          stock_quantity: 10,
          is_active: true,
        },
        {
          id: '2',
          name: 'שרשרת צ\'אקרות',
          description: 'שרשרת מיוחדת לאיזון האנרגיות עם אבני חן טבעיות',
          price: 320,
          image_url: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
          category: 'תכשיטים',
          stock_quantity: 5,
          is_active: true,
        },
        {
          id: '3',
          name: 'מחצלת יוגה פרימיום',
          description: 'מחצלת יוגה איכותית עם אחיזה מעולה ועמידות לאורך זמן',
          price: 250,
          image_url: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
          category: 'ציוד יוגה',
          stock_quantity: 15,
          is_active: true,
        },
        {
          id: '4',
          name: 'ספר מדיטציה',
          description: 'מדריך מקיף למדיטציה יומית ותרגולי נשימה',
          price: 120,
          image_url: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
          category: 'ספרים',
          stock_quantity: 20,
          is_active: true,
        },
        {
          id: '5',
          name: 'חולצת יוגה אורגנית',
          description: 'חולצה נוחה ונושמת מכותנה אורגנית לתרגול יוגה',
          price: 180,
          image_url: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
          category: 'בגדים',
          stock_quantity: 12,
          is_active: true,
        },
        {
          id: '6',
          name: 'טבעת כסף בעיצוב מנדלה',
          description: 'טבעת כסף מעוצבת בהשראת מנדלות מסורתיות',
          price: 280,
          image_url: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
          category: 'תכשיטים',
          stock_quantity: 8,
          is_active: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600 mx-auto mb-4"></div>
          <p className="text-sage-600 font-hebrew">טוען מוצרים...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-sage-800 mb-4 font-hebrew">
            קולקציית הסטודיו
          </h1>
          <p className="text-lg text-sage-600 max-w-2xl mx-auto font-hebrew-light">
            מוצרים נבחרים בקפידה לתמיכה בתרגול היוגה והמדיטציה שלכם
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="חפש מוצרים..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent text-right"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sage-500 focus:border-transparent font-hebrew text-right"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Link 
              key={product.id} 
              to={`/store/product/${product.id}`}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="block bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-64 object-cover"
                  loading="lazy"
                  decoding="async"
                />
                {product.stock_quantity <= 5 && (
                  <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-hebrew">
                    נותרו {product.stock_quantity}
                  </div>
                )}
              </div>
              
              <div className="p-6 text-right">
                <h3 className="text-lg font-bold text-sage-800 mb-2 font-hebrew">
                  {product.name}
                </h3>
                
                <p className="text-sage-600 text-sm mb-4 font-hebrew-light leading-relaxed line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-sage-800 font-hebrew">
                    ₪{product.price}
                  </span>
                  {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-hebrew">
                      נותרו {product.stock_quantity}
                    </span>
                  )}
                  {product.stock_quantity === 0 && (
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-hebrew">
                      אזל מהמלאי
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 font-hebrew text-lg">לא נמצאו מוצרים התואמים לחיפוש</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StorePage;