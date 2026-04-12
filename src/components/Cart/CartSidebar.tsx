import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import useCartStore from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

interface CartSidebarProps {
  onAuthRequired: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ onAuthRequired }) => {
  const navigate = useNavigate();
  const { items, isOpen, toggleCart, updateQuantity, removeItem, getTotalPrice } = useCartStore();
  const { user } = useAuthStore();

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('הסל ריק');
      return;
    }

    if (!user) {
      onAuthRequired();
      return;
    }

    toggleCart();
    navigate('/checkout');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={toggleCart} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <button onClick={toggleCart} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-bold text-sage-800 font-hebrew">סל הקניות</h2>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-hebrew mb-4">הסל שלך ריק</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 rtl:space-x-reverse bg-gray-50 p-4 rounded-lg">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1 text-right">
                      <h3 className="font-medium text-sage-800 font-hebrew">{item.name}</h3>
                      <p className="text-sage-600 font-hebrew">₪{item.price}</p>
                    </div>

                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-bold text-sage-800 font-hebrew">₪{getTotalPrice()}</span>
                <span className="text-lg font-medium text-sage-600 font-hebrew">סה"כ:</span>
              </div>
              
              <button
                onClick={handleCheckout}
                className="w-full bg-sage-600 hover:bg-sage-700 text-white py-3 rounded-lg font-hebrew font-medium transition-colors"
              >
                המשך לתשלום
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;