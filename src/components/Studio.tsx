import React from 'react';
import { useAuthStore } from '../store/authStore';
import ImageUploader from './ImageUpload/ImageUploader';
import { useSiteImage } from '../hooks/useSiteImage';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const Studio = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.email === 'limorbendavid29@gmail.com' || user?.email === 'admin@kamisha.com';
  const [isEditingImage, setIsEditingImage] = React.useState(false);
  
  const { imageUrl, updateImage } = useSiteImage(
    'studio',
    'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop'
  );

  useScrollAnimation();

  return (
    <section id="studio" className="py-20 bg-gradient-to-br from-sage-50 to-warm-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Content with title inside */}
          <div className="order-1 lg:order-1 text-right scroll-animate fade-right">
            <div className="mb-8 scroll-animate fade-up">
              <h2 className="text-3xl md:text-4xl font-bold text-sage-800 font-hebrew">
                הסטודיו
              </h2>
            </div>
            <div className="space-y-6 text-sage-600 font-hebrew-light text-lg leading-relaxed scroll-animate fade-up">
              <p className="scroll-animate fade-up">
                הסטודיו שלי נולד מתוך רצון ליצור קהילה במרחב שהוא גם אינטימי וגם מעורר השראה — כזה שמזהה את מי שנכנס אליו, ויודע לראות מעבר.
              </p>
              <p className="scroll-animate fade-up">
                אני מאמינה בהנחיה שמחוברת ללב, באווירה שמעודדת ביטוי וסקרנות ובמפגש שבו כל מתרגל מקבל הזדמנות לפגוש את עצמו ובדיוק את מה שנכון עבורו.
              </p>
              <p className="scroll-animate fade-up">
                מעבר לשיעורים האישיים והקבוצתיים, אני מפתחת סדנאות קונספט, וריטריטים שמעמיקים את התרגול הפילוסופי הפיזי והמנטלי, לצד תוכנית ליווי תהליכית שאני גאה בה במיוחד — ליווי גופנפש הוליסטי שמבוסס על הקשבה, הבנה עמוקה של האדם שמולי, מתן כלים ושאלת שאלות מדייקות שמובילות אותו למצוא את התשובות.
              </p>
            </div>
          </div>

          {/* Image */}
          <div className="order-2 lg:order-2 scroll-animate fade-left">
            <div className="relative">
              <img
                src={imageUrl}
                alt="סטודיו ליוגה קמישה - מרחב אינטימי ומעורר השראה"
                className="rounded-2xl shadow-2xl w-full h-96 object-cover"
                loading="lazy"
                decoding="async"
              />
              {isAdmin && (
                <button
                  onClick={() => setIsEditingImage(true)}
                  className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                  title="עדכן תמונה"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              )}
             <div
  className="absolute -bottom-6 -left-6 p-6 rounded-2xl shadow-lg"
  style={{ backgroundColor: '#F5E4DF' }}
>
  <p className="font-hebrew font-bold text-lg" style={{ color: '#6B4C4C' }}>
    מרחב אינטימי
  </p>
  <p className="font-hebrew-light" style={{ color: '#6B4C4C' }}>
    ומעורר השראה
  </p>
</div>
            </div>
          </div>

        </div>
      </div>
      
      {/* מודל עריכת תמונה */}
      {isEditingImage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setIsEditingImage(false)}
              className="absolute top-4 left-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-sage-800 font-hebrew">
                עדכן תמונה
              </h2>
            </div>

            <ImageUploader
              onImageUploaded={(url) => {
                updateImage(url);
                setIsEditingImage(false);
              }}
              folder="studio"
              buttonText="העלה תמונה חדשה"
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default Studio;