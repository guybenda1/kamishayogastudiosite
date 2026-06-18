import React, { useEffect, useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import useCartStore from './store/cartStore';
import { useSiteImagesStore } from './store/siteImagesStore';

// Components - homepage sections bundled together to prevent layout jumping
import Header from './components/Header';
import Footer from './components/Footer';
import AuthModal from './components/Auth/AuthModal';
import CartSidebar from './components/Cart/CartSidebar';
import Hero from './components/Hero';
import About from './components/About';
import Studio from './components/Studio';
import Gallery from './components/Gallery';
import Classes from './components/Classes';
import Retreats from './components/Retreats';
import Jewelry from './components/Jewelry';
import Products from './components/Products';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';

// Lazy load only route-specific components (not on the home page)
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
  <>
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
  </>
);

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { initialize, user } = useAuthStore();
  const fetchSiteImages = useSiteImagesStore((s) => s.fetchAll);

  useEffect(() => {
    initialize();
    fetchSiteImages();
  }, [initialize, fetchSiteImages]);

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