import React, { useEffect, useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import useCartStore from './store/cartStore';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import AuthModal from './components/Auth/AuthModal';
import CartSidebar from './components/Cart/CartSidebar';

// Lazy load components for better performance
const Hero = lazy(() => import('./components/Hero'));
const About = lazy(() => import('./components/About'));
const Studio = lazy(() => import('./components/Studio'));
const Gallery = lazy(() => import('./components/Gallery'));
const Classes = lazy(() => import('./components/Classes'));
const Retreats = lazy(() => import('./components/Retreats'));
const Jewelry = lazy(() => import('./components/Jewelry'));
const Products = lazy(() => import('./components/Products'));
const Testimonials = lazy(() => import('./components/Testimonials'));
const Contact = lazy(() => import('./components/Contact'));
const StorePage = lazy(() => import('./components/Store/StorePage'));
const ProductPage = lazy(() => import('./components/Store/ProductPage'));
const CheckoutPage = lazy(() => import('./components/Checkout/CheckoutPage'));
const AdminPanel = lazy(() => import('./components/Admin/AdminPanel'));
const UserProfile = lazy(() => import('./components/Profile/UserProfile'));
const UserOrders = lazy(() => import('./components/Orders/UserOrders'));
const NotFound = lazy(() => import('./components/NotFound'));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-12">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-600"></div>
  </div>
);

// Home Page Component
const HomePage = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <Hero />
    <About />
    <Studio />
    <Gallery />
    <Classes />
    <Retreats />
    <Jewelry />
    <Products />
    <Testimonials />
    <Contact />
  </Suspense>
);

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { initialize, user } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <Router>
      <div className="min-h-screen" dir="rtl">
        <Header onAuthClick={() => setIsAuthModalOpen(true)} />
        
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/store" element={<StorePage />} />
            <Route path="/store/product/:id" element={<ProductPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/orders" element={<UserOrders />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        
        <Footer />
        
        {/* Modals and Sidebars */}
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
        />
        <CartSidebar 
          onAuthRequired={() => setIsAuthModalOpen(true)} 
        />
        
        {/* Toast Notifications */}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#374151',
              color: '#fff',
              fontFamily: 'Heebo, sans-serif',
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;