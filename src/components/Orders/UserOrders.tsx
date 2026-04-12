import React, { useState, useEffect } from 'react';
import { Package, Eye, Calendar, CreditCard, MapPin, Truck } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  product_name?: string;
  product_image?: string;
}

interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: string;
  shipping_address: any;
  created_at: string;
  updated_at: string;
  tracking_number?: string;
  items?: OrderItem[];
}

const UserOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useScrollAnimation();

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Fetch order items for each order
      const ordersWithItems = await Promise.all(
        (ordersData || []).map(async (order) => {
          const { data: itemsData, error: itemsError } = await supabase
            .from('order_items')
            .select(`
              *,
              products (
                name,
                image_url
              )
            `)
            .eq('order_id', order.id);

          if (itemsError) {
            console.error('Error fetching order items:', itemsError);
            return { ...order, items: [] };
          }

          const items = itemsData?.map(item => ({
            ...item,
            product_name: item.products?.name,
            product_image: item.products?.image_url
          })) || [];

          return { ...order, items };
        })
      );

      setOrders(ordersWithItems);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('שגיאה בטעינת ההזמנות');
      // Mock data for demonstration
      setOrders([
        {
          id: '1',
          user_id: user?.id || '',
          total_amount: 450,
          status: 'delivered',
          shipping_address: {
            name: 'יוסי כהן',
            street: 'רחוב הרצל 123',
            city: 'תל אביב',
            postal_code: '12345',
            phone: '050-1234567'
          },
          created_at: '2024-01-15T10:30:00Z',
          updated_at: '2024-01-18T14:20:00Z',
          tracking_number: 'IL123456789',
          items: [
            {
              id: '1',
              product_id: '1',
              quantity: 1,
              price: 180,
              product_name: 'צמיד מדיטציה',
              product_image: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop'
            },
            {
              id: '2',
              product_id: '3',
              quantity: 1,
              price: 250,
              product_name: 'מחצלת יוגה פרימיום',
              product_image: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop'
            }
          ]
        },
        {
          id: '2',
          user_id: user?.id || '',
          total_amount: 320,
          status: 'shipped',
          shipping_address: {
            name: 'יוסי כהן',
            street: 'רחוב הרצל 123',
            city: 'תל אביב',
            postal_code: '12345',
            phone: '050-1234567'
          },
          created_at: '2024-01-20T09:15:00Z',
          updated_at: '2024-01-22T11:45:00Z',
          tracking_number: 'IL987654321',
          items: [
            {
              id: '3',
              product_id: '2',
              quantity: 1,
              price: 320,
              product_name: 'שרשרת צ\'אקרות',
              product_image: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop'
            }
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'ממתין לאישור';
      case 'processing':
        return 'בעיבוד';
      case 'shipped':
        return 'נשלח';
      case 'delivered':
        return 'נמסר';
      case 'cancelled':
        return 'בוטל';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 font-hebrew">יש להתחבר כדי לצפות בהזמנות</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600 mx-auto mb-4"></div>
          <p className="text-sage-600 font-hebrew">טוען הזמנות...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-warm-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 scroll-animate fade-up">
          <div className="text-center">
            <div className="w-20 h-20 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-sage-600" />
            </div>
            <h1 className="text-3xl font-bold text-sage-800 font-hebrew">ההזמנות שלי</h1>
            <p className="text-sage-600 font-hebrew-light">צפה בכל ההזמנות שלך ובמצבן</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center scroll-animate fade-up">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-600 font-hebrew mb-2">אין הזמנות עדיין</h2>
            <p className="text-gray-500 font-hebrew-light">כשתבצע הזמנות, הן יופיעו כאן</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow scroll-animate fade-up">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-right">
                    <h3 className="text-lg font-bold text-sage-800 font-hebrew">
                      הזמנה #{order.id.slice(-6)}
                    </h3>
                    <p className="text-sm text-gray-500 font-hebrew-light">
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-hebrew font-medium ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-sage-800 font-hebrew">₪{order.total_amount}</span>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse text-gray-600">
                      <CreditCard className="w-4 h-4" />
                      <span className="text-sm font-hebrew-light">סה"כ</span>
                    </div>
                  </div>

                  {order.tracking_number && (
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm">{order.tracking_number}</span>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse text-gray-600">
                        <Truck className="w-4 h-4" />
                        <span className="text-sm font-hebrew-light">מספר מעקב</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 font-hebrew-light">
                      {order.items?.length || 0} פריטים
                    </span>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse text-gray-600">
                      <Package className="w-4 h-4" />
                      <span className="text-sm font-hebrew-light">פריטים</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedOrder(order)}
                  className="w-full bg-sage-100 hover:bg-sage-200 text-sage-700 py-3 rounded-lg font-hebrew font-medium transition-colors flex items-center justify-center space-x-2 rtl:space-x-reverse"
                >
                  <Eye className="w-5 h-5" />
                  <span>צפה בפרטים</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-sage-800 font-hebrew">
                    פרטי הזמנה #{selectedOrder.id.slice(-6)}
                  </h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Order Status & Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-sage-50 p-4 rounded-lg text-center">
                    <Calendar className="w-6 h-6 text-sage-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 font-hebrew-light">תאריך הזמנה</p>
                    <p className="font-bold text-sage-800 font-hebrew">
                      {formatDate(selectedOrder.created_at)}
                    </p>
                  </div>
                  <div className="bg-warm-50 p-4 rounded-lg text-center">
                    <CreditCard className="w-6 h-6 text-warm-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 font-hebrew-light">סכום כולל</p>
                    <p className="font-bold text-warm-800 font-hebrew text-xl">
                      ₪{selectedOrder.total_amount}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <Package className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 font-hebrew-light">סטטוס</p>
                    <span className={`px-3 py-1 rounded-full text-sm font-hebrew font-medium ${getStatusColor(selectedOrder.status)}`}>
                      {getStatusText(selectedOrder.status)}
                    </span>
                  </div>
                </div>

                {/* Tracking Number */}
                {selectedOrder.tracking_number && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <Truck className="w-6 h-6 text-blue-600" />
                      <div className="text-right">
                        <p className="text-sm text-gray-600 font-hebrew-light">מספר מעקב</p>
                        <p className="font-bold text-blue-800 font-mono text-lg">
                          {selectedOrder.tracking_number}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Shipping Address */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-3 rtl:space-x-reverse">
                    <MapPin className="w-6 h-6 text-gray-600 mt-1" />
                    <div className="text-right">
                      <h3 className="font-bold text-gray-800 font-hebrew mb-2">כתובת משלוח</h3>
                      <div className="space-y-1 text-gray-600 font-hebrew-light">
                        <p>{selectedOrder.shipping_address?.name}</p>
                        <p>{selectedOrder.shipping_address?.street}</p>
                        <p>{selectedOrder.shipping_address?.city} {selectedOrder.shipping_address?.postal_code}</p>
                        <p>{selectedOrder.shipping_address?.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="text-xl font-bold text-sage-800 font-hebrew mb-4">פריטים בהזמנה</h3>
                  <div className="space-y-4">
                    {selectedOrder.items?.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 rtl:space-x-reverse p-4 bg-white border rounded-lg">
                        <img
                          src={item.product_image}
                          alt={item.product_name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1 text-right">
                          <h4 className="font-bold text-gray-800 font-hebrew">{item.product_name}</h4>
                          <p className="text-gray-600 font-hebrew-light">כמות: {item.quantity}</p>
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-sage-800 font-hebrew">₪{item.price}</p>
                          <p className="text-sm text-gray-500 font-hebrew-light">
                            ₪{item.price * item.quantity} סה"כ
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrders;