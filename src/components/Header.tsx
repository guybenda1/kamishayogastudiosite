import React, { useState } from 'react';
import { Menu, X, ShoppingCart, User, LogOut, UserCircle, Package } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import useCartStore from '../store/cartStore';

interface HeaderProps {
  onAuthClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAuthClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, signOut } = useAuthStore();
  const toggleCart = useCartStore((state) => state.toggleCart);
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isHomePage = location.pathname === '/';

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* הגדרנו את ה-Header container כ-relative ו-flex עם יישור אנכי */}
        <div className="flex items-center justify-between h-16 relative"> 
          
          {/* 1. Mobile Layout - Far Left (Auth Icon) - הוסתר במובייל באמצעות opacity-0 */}
          {/* כדי לשמור על הרווח שלו ב-flexbox (justify-between) */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse md:hidden order-3 opacity-0 pointer-events-none"> 
            {/* אייקון התחברות (הוסתר במובייל) */}
            <button
              onClick={onAuthClick}
              className="p-2 text-sage-800 hover:text-sage-900 transition-colors"
              title="התחבר"
            >
              <User className="w-6 h-6" />
            </button>
          </div>

          {/* 2. Mobile Layout - Exact Center (Logo) */}
          {/* הקלאסים left-1/2, top-1/2, -translate-x-1/2, -translate-y-1/2 ממקמים במרכז בדיוק */}
          <div className="md:hidden absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            <Link to="/">
              <img 
                src="https://eyotdvabnyowlmdqctsg.supabase.co/storage/v1/object/sign/store/IMG_5702-removebg-preview-optimized.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iZjg3OTU2OC05MWUyLTQxYzYtYmU3MC0wMDZiOTcyZmExY2UiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJzdG9yZS9JTUdfNTcwMi1yZW1vdmViZy1wcmV2aWV3LW9wdGltaXplZC53ZWJwIiwiaWF0IjoxNzU1NTkyNDE0LCJleHAiOjE3ODcxMjg0MTR9.ukgPpGSN7VVFXDal5_qNeK1cw5ohp5Fq_0rmoDxiKXc" 
                alt="Kamisha Boutique Yoga Studio" 
                className="h-12 w-auto"
              />
            </Link>
          </div>
          
          {/* 3. Mobile Layout - Far Right (Menu Button) */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse md:hidden order-1 z-10">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-sage-800 hover:text-sage-900"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Desktop Layout - שמירה על הפריסה הקיימת (ללא שינוי) */}
          <div className="hidden md:flex items-center justify-between w-full">
            {/* Logo - Desktop */}
            <div className="flex-shrink-0">
              <Link to="/">
                <img 
                  src="https://eyotdvabnyowlmdqctsg.supabase.co/storage/v1/object/sign/store/IMG_5702-removebg-preview-optimized.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iZjg3OTU2OC05MWUyLTQxYzYtYmU3MC0wMDZiOTcyZmExY2UiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJzdG9yZS9JTUdfNTcwMi1yZW1vdmViZy1wcmV2aWV3LW9wdGltaXplZC53ZWJwIiwiaWF0IjoxNzU1NTkyNDE0LCJleHAiOjE3ODcxMjg0MTR9.ukgPpGSN7VVFXDal5_qNeK1cw5ohp5Fq_0rmoDxiKXc" 
                  alt="Kamisha Boutique Yoga Studio" 
                  className="h-12 w-auto"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="flex space-x-8 rtl:space-x-reverse">
              <Link 
                to="/" 
                onClick={handleHomeClick}
                className="text-sage-800 hover:text-sage-900 font-hebrew font-bold transition-all duration-300 hover:border-b-2 hover:border-sage-600 pb-1 border-b-2 border-transparent"
              >
                בית
              </Link>
              {isHomePage && (
                <>
                  <a href="#about" className="text-sage-800 hover:text-sage-900 font-hebrew font-bold transition-all duration-300 hover:border-b-2 hover:border-sage-600 pb-1 border-b-2 border-transparent">
                    אודותיי
                  </a>
                  <a href="#studio" className="text-sage-800 hover:text-sage-900 font-hebrew font-bold transition-all duration-300 hover:border-b-2 hover:border-sage-600 pb-1 border-b-2 border-transparent">
                    הסטודיו
                  </a>
                  <a href="#gallery" className="text-sage-800 hover:text-sage-900 font-hebrew font-bold transition-all duration-300 hover:border-b-2 hover:border-sage-600 pb-1 border-b-2 border-transparent">
                    גלריה
                  </a>
                  <a href="#classes" className="text-sage-800 hover:text-sage-900 font-hebrew font-bold transition-all duration-300 hover:border-b-2 hover:border-sage-600 pb-1 border-b-2 border-transparent">
                    רישום לתרגולים
                  </a>
                  <a href="#retreats" className="text-sage-800 hover:text-sage-900 font-hebrew font-bold transition-all duration-300 hover:border-b-2 hover:border-sage-600 pb-1 border-b-2 border-transparent">
                    ריטריטים
                  </a>
                </>
              )}
              {isHomePage && (
                <a href="#contact" className="text-sage-800 hover:text-sage-900 font-hebrew font-bold transition-all duration-300 hover:border-b-2 hover:border-sage-600 pb-1 border-b-2 border-transparent">
                  צור קשר
                </a>
              )}
            </nav>

            {/* Right side icons - Desktop (כולל כפתור התחברות) */}
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              {/* User Menu - Desktop */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 rtl:space-x-reverse p-2 text-sage-800 hover:text-sage-900 transition-colors"
                  >
                    <UserCircle className="w-6 h-6" />
                    <span className="hidden md:block text-sm font-hebrew">
                      {user.user_metadata?.full_name || user.email?.split('@')[0]}
                    </span>
                  </button>
                  
                  {isUserMenuOpen && (
                    <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
                      <div className="py-2">
                        <Link
                          to="/profile"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center space-x-3 rtl:space-x-reverse px-4 py-2 text-gray-700 hover:bg-sage-50 font-hebrew"
                        >
                          <User className="w-4 h-4" />
                          <span>הפרופיל שלי</span>
                        </Link>
                        <Link
                          to="/orders"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center space-x-3 rtl:space-x-reverse px-4 py-2 text-gray-700 hover:bg-sage-50 font-hebrew"
                        >
                          <Package className="w-4 h-4" />
                          <span>ההזמנות שלי</span>
                        </Link>
                        <hr className="my-1" />
                        <button
                          onClick={() => {
                            handleSignOut();
                            setIsUserMenuOpen(false);
                          }}
                          className="flex items-center space-x-3 rtl:space-x-reverse px-4 py-2 text-red-600 hover:bg-red-50 font-hebrew w-full text-right"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>התנתק</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={onAuthClick}
                  className="p-2 text-sage-800 hover:text-sage-900 transition-colors"
                  title="התחבר"
                >
                  <User className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu - ללא שינוי */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="mobile-menu px-4 pt-4 pb-6 space-y-3 bg-gradient-to-br from-sage-50 to-warm-50 border-t-2 border-sage-200 shadow-lg text-right">
              <Link 
                to="/" 
                className="block px-4 py-3 text-sage-700 hover:text-white hover:bg-sage-600 font-hebrew font-medium rounded-xl transition-all duration-300 text-right text-lg"
                onClick={(e) => {
                  handleHomeClick(e);
                  setIsMenuOpen(false);
                }}
              >
                בית
              </Link>
              {isHomePage && (
                <>
                  <a 
                    href="#about" 
                    className="block px-4 py-3 text-sage-700 hover:text-white hover:bg-sage-600 font-hebrew font-medium rounded-xl transition-all duration-300 text-right text-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    אודותיי
                  </a>
                  <a 
                    href="#studio" 
                    className="block px-4 py-3 text-sage-700 hover:text-white hover:bg-sage-600 font-hebrew font-medium rounded-xl transition-all duration-300 text-right text-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    הסטודיו
                  </a>
                  <a 
                    href="#classes" 
                    className="block px-4 py-3 text-sage-700 hover:text-white hover:bg-sage-600 font-hebrew font-medium rounded-xl transition-all duration-300 text-right text-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    רישום לתרגולים
                  </a>
                  <a 
                    href="#gallery" 
                    className="block px-4 py-3 text-sage-700 hover:text-white hover:bg-sage-600 font-hebrew font-medium rounded-xl transition-all duration-300 text-right text-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    גלריה
                  </a>
                  <a 
                    href="#retreats" 
                    className="block px-4 py-3 text-sage-700 hover:text-white hover:bg-sage-600 font-hebrew font-medium rounded-xl transition-all duration-300 text-right text-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    ריטריטים
                  </a>
                </>
              )}
              {isHomePage && (
                <a
                  href="#contact"
                  className="block px-4 py-3 text-sage-700 hover:text-white hover:bg-sage-600 font-hebrew font-medium rounded-xl transition-all duration-300 text-right text-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  צור קשר
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;