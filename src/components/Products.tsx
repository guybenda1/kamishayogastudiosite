import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import useCartStore from '../store/cartStore';
import toast from 'react-hot-toast';

const Products = () => {
  const [products, setProducts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { user } = useAuthStore();
  const { addItem } = useCartStore();

  // מוצרי גיבוי במקרה שהמסד לא עובד
  const fallbackProducts = [
    {
      id: '1',
      name: "צמיד מדיטציה",
      description: "צמיד עשוי אבנים טבעיות לחיזוק המיקוד והשלווה",
      price: 180,
      image_url: "https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
      category: "תכשיטים",
      stock_quantity: 10,
      is_active: true,
    },
    {
      id: '2',
      name: "שרשרת צ'אקרות",
      description: "שרשרת מיוחדת לאיזון האנרגיות עם אבני חן טבעיות",
      price: 320,
      image_url: "https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
      category: "תכשיטים",
      stock_quantity: 5,
      is_active: true,
    },
    {
      id: '3',
      name: "מחצלת יוגה פרימיום",
      description: "מחצלת יוגה איכותית עם אחיזה מעולה ועמידות לאורך זמן",
      price: 250,
      image_url: "https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
      category: "ציוד יוגה",
      stock_quantity: 15,
      is_active: true,
    },
    {
      id: '4',
      name: "ספר מדיטציה",
      description: "מדריך מקיף למדיטציה יומית ותרגולי נשימה",
      price: 120,
      image_url: "https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
      category: "ספרים",
      stock_quantity: 20,
      is_active: true,
    }
  ];

  React.useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // טעינה מהמסד נתונים
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(4);

      if (error) {
        console.error('Error fetching products:', error);
        // במקרה של שגיאה, השתמש במוצרי גיבוי
        setProducts(fallbackProducts);
      } else if (data && data.length > 0) {
        // השתמש במוצרים מהמסד
        setProducts(data);
      } else {
        // אם אין מוצרים במסד, השתמש במוצרי גיבוי
        setProducts(fallbackProducts);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      // במקרה של שגיאה, השתמש במוצרי גיבוי
      setProducts(fallbackProducts);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
    });
    toast.success('המוצר נוסף לסל!');
  };

  if (loading) {
    return (
      <section id="products" className="py-20 bg-warm-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600 mx-auto mb-4"></div>
          <p className="text-sage-600 font-hebrew">טוען מוצרים...</p>
        </div>
      </section>
    );
  }

  {/* Products section - Hidden for now */}
  return null;

  /* Original code saved for future use:
  return (
    <section id="products" className="py-20 bg-warm-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-sage-800 mb-4 font-hebrew">
            קולקציית הסטודיו
          </h2>
          <p className="text-lg text-sage-600 max-w-2xl mx-auto font-hebrew-light">
            מוצרים נבחרים לתמיכה בתרגול היוגה והמדיטציה שלכם
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {products.slice(0, 4).map((product) => (
            <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="relative">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-48 object-cover"
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

                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-bold text-sage-800 font-hebrew">
                    ₪{product.price}
                  </span>
                </div>

                <div className="space-y-3">
                  <Link
                    to={`/store/product/${product.id}`}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="w-full bg-sage-100 hover:bg-sage-200 text-sage-700 py-3 rounded-lg font-hebrew font-medium transition-colors duration-300 flex items-center justify-center space-x-2 rtl:space-x-reverse"
                  >
                    <span>פרטים נוספים</span>
                    <ArrowLeft className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock_quantity === 0}
                    className="w-full bg-sage-600 hover:bg-sage-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-lg font-hebrew font-medium transition-colors duration-300 flex items-center justify-center space-x-2 rtl:space-x-reverse"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>{product.stock_quantity === 0 ? 'אזל מהמלאי' : 'הוסף לסל'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 font-hebrew text-lg">אין מוצרים זמינים כרגע</p>
          </div>
        )}

        <div className="text-center">
          <Link
            to="/store"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center bg-sage-600 hover:bg-sage-700 text-white px-8 py-4 rounded-lg font-hebrew font-medium transition-colors duration-300 transform hover:scale-105 space-x-2 rtl:space-x-reverse"
          >
            <span>צפה בכל המוצרים</span>
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
  */
};

export default Products;