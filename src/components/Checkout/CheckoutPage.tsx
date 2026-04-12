import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CreditCard, User, MapPin, Phone, Mail } from 'lucide-react';
import useCartStore from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';

interface ShippingDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  notes: string;
}

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
    fullName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    notes: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setShippingDetails({
      ...shippingDetails,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!shippingDetails.fullName.trim()) {
      toast.error('יש למלא שם מלא');
      return false;
    }
    if (!shippingDetails.email.trim()) {
      toast.error('יש למלא כתובת אימייל');
      return false;
    }
    if (!shippingDetails.phone.trim()) {
      toast.error('יש למלא מספר טלפון');
      return false;
    }
    if (!shippingDetails.address.trim()) {
      toast.error('יש למלא כתובת');
      return false;
    }
    if (!shippingDetails.city.trim()) {
      toast.error('יש למלא עיר');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (items.length === 0) {
      toast.error('הסל ריק');
      return;
    }
    if (!user) {
      toast.error('יש להתחבר כדי להשלים הזמנה');
      return;
    }

    setLoading(true);

    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: getTotalPrice(),
          status: 'pending',
          shipping_address: {
            fullName: shippingDetails.fullName,
            email: shippingDetails.email,
            phone: shippingDetails.phone,
            address: shippingDetails.address,
            city: shippingDetails.city,
            zipCode: shippingDetails.zipCode,
            notes: shippingDetails.notes
          }
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      clearCart();
      toast.success('ההזמנה נשלחה בהצלחה!');
      navigate('/profile/orders');

    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('שגיאה ביצירת ההזמנה');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-bold text-sage-800 mb-4 font-hebrew">הסל ריק</h2>
            <p className="text-gray-600 mb-6 font-hebrew">אין מוצרים בסל הקניות</p>
            <button
              onClick={() => navigate('/store')}
              className="bg-sage-600 hover:bg-sage-700 text-white px-6 py-3 rounded-lg font-hebrew transition-colors"
            >
              חזור לחנות
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 rtl:space-x-reverse text-sage-600 hover:text-sage-700 mb-6 font-hebrew"
        >
          <ArrowRight className="w-5 h-5" />
          <span>חזור</span>
        </button>

        <h1 className="text-3xl font-bold text-sage-800 mb-8 font-hebrew">השלמת הזמנה</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-sage-800 mb-4 font-hebrew flex items-center space-x-2 rtl:space-x-reverse">
                  <User className="w-5 h-5" />
                  <span>פרטים אישיים</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-hebrew text-right">
                      שם מלא *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={shippingDetails.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent text-right"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-hebrew text-right">
                      אימייל *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={shippingDetails.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent text-right"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-hebrew text-right">
                      טלפון *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingDetails.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent text-right"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-sage-800 mb-4 font-hebrew flex items-center space-x-2 rtl:space-x-reverse">
                  <MapPin className="w-5 h-5" />
                  <span>כתובת למשלוח</span>
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-hebrew text-right">
                      כתובת מלאה *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={shippingDetails.address}
                      onChange={handleInputChange}
                      placeholder="רחוב ומספר בית"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent text-right"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 font-hebrew text-right">
                        עיר *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={shippingDetails.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent text-right"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 font-hebrew text-right">
                        מיקוד
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={shippingDetails.zipCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent text-right"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-hebrew text-right">
                      הערות למשלוח
                    </label>
                    <textarea
                      name="notes"
                      value={shippingDetails.notes}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="הוראות משלוח, קומה, וכו׳"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent text-right"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-sage-600 hover:bg-sage-700 text-white py-4 rounded-lg font-hebrew font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 rtl:space-x-reverse"
              >
                <CreditCard className="w-5 h-5" />
                <span>{loading ? 'מעבד...' : 'המשך לתשלום'}</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-sage-800 mb-4 font-hebrew">סיכום הזמנה</h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 text-right">
                      <h3 className="font-medium text-sage-800 font-hebrew text-sm">{item.name}</h3>
                      <p className="text-gray-600 text-sm font-hebrew">כמות: {item.quantity}</p>
                    </div>
                    <span className="font-semibold text-sage-700 font-hebrew">₪{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-hebrew">סכום ביניים:</span>
                  <span className="font-semibold text-sage-800 font-hebrew">₪{getTotalPrice()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-hebrew">משלוח:</span>
                  <span className="font-semibold text-sage-800 font-hebrew">
                    {getTotalPrice() >= 200 ? 'חינם' : '₪30'}
                  </span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-sage-800 font-hebrew">סה״כ:</span>
                    <span className="text-2xl font-bold text-sage-800 font-hebrew">
                      ₪{getTotalPrice() >= 200 ? getTotalPrice() : getTotalPrice() + 30}
                    </span>
                  </div>
                </div>
              </div>

              {getTotalPrice() < 200 && (
                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800 font-hebrew text-right">
                    הוסף עוד ₪{200 - getTotalPrice()} לסל כדי לקבל משלוח חינם
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
