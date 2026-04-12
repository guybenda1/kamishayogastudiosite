import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowRight } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const NotFound = () => {
  useScrollAnimation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-warm-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center scroll-animate fade-up">
        {/* 404 Number */}
        <div className="mb-8 scroll-animate fade-up">
          <h1 className="text-9xl font-bold text-sage-300 mb-4">404</h1>
          <div className="w-24 h-1 bg-sage-600 mx-auto rounded-full"></div>
        </div>

        {/* Error Message */}
        <div className="mb-8 scroll-animate fade-up">
          <h2 className="text-3xl font-bold text-sage-800 mb-4 font-hebrew">
            הדף לא נמצא
          </h2>
          <p className="text-lg text-sage-600 font-hebrew-light leading-relaxed">
            מצטערים, הדף שחיפשת לא קיים או הועבר למקום אחר.
          </p>
        </div>

        {/* Illustration */}
        <div className="mb-8 scroll-animate fade-up">
          <div className="w-32 h-32 bg-sage-100 rounded-full mx-auto flex items-center justify-center mb-4">
            <div className="text-6xl">🧘‍♀️</div>
          </div>
          <p className="text-sage-500 font-hebrew-light text-sm">
            אולי הגיע הזמן לנשום עמוק ולחזור לעמוד הבית?
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 scroll-animate fade-up">
          <Link
            to="/"
            className="inline-flex items-center justify-center w-full bg-sage-600 hover:bg-sage-700 text-white px-8 py-4 rounded-2xl font-hebrew font-medium transition-all duration-300 transform hover:scale-105 shadow-lg space-x-3 rtl:space-x-reverse"
          >
            <Home className="w-5 h-5" />
            <span>חזור לעמוד הבית</span>
          </Link>
          
          <Link
            to="/store"
            className="inline-flex items-center justify-center w-full border-2 border-sage-600 text-sage-600 hover:bg-sage-50 px-8 py-4 rounded-2xl font-hebrew font-medium transition-all duration-300 space-x-3 rtl:space-x-reverse"
          >
            <ArrowRight className="w-5 h-5" />
            <span>עבור לחנות</span>
          </Link>
        </div>

        {/* Additional Help */}
        <div className="mt-8 p-4 bg-white/50 rounded-xl scroll-animate fade-up">
          <p className="text-sm text-sage-600 font-hebrew-light">
            אם אתה מחפש משהו ספציפי, נסה להשתמש בתפריט הניווט או
            <a href="#contact" className="text-sage-800 hover:text-sage-900 font-medium underline mx-1">
              צור איתנו קשר
            </a>
            לעזרה נוספת.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;