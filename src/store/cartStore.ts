import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,

      addItem: (product) => {
        set((state) => {
          const items = state.items;
        const existingItem = items.find(item => item.id === product.id);

        if (existingItem) {
          return {
            ...state,
            items: items.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          };
        } else {
          return {
            ...state,
            items: [...items, { ...product, quantity: 1 }],
          };
        }
        });
      },

      removeItem: (id) => {
        set((state) => ({
          ...state,
          items: state.items.filter(item => item.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        const { removeItem } = useCartStore.getState();
        if (quantity <= 0) {
          removeItem(id);
          return;
        }

        set((state) => ({
          ...state,
          items: state.items.map(item =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set((state) => ({ ...state, items: [] }));
      },

      toggleCart: () => {
        set((state) => ({ ...state, isOpen: !state.isOpen }));
      },

      getTotalItems: () => {
        return useCartStore.getState().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return useCartStore.getState().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);

export default useCartStore;