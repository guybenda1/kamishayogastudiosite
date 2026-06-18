import React from 'react';
import { useAuthStore } from '../store/authStore';
import ImageUploader from './ImageUpload/ImageUploader';
import { useSiteImage } from '../hooks/useSiteImage';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const About = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.email === 'limorbendavid29@gmail.com' || user?.email === 'admin@kamisha.com';
  const [isEditingImage, setIsEditingImage] = React.useState(false);
  
  const { imageUrl, updateImage } = useSiteImage(
    'about',
    'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop'
  );

  useScrollAnimation();

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="order-2 lg:order-1 scroll-animate fade-left">
            <div className="relative">
              <img src={imageUrl}
                alt="לימור - מורה יוגה אשטנגה-ויניאסה"
                className="rounded-2xl shadow-2xl w-full h-96 lg:h-128 object-cover"
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
                className="absolute -bottom-6 -right-6 p-6 rounded-2xl shadow-lg"
                style={{ backgroundColor: '#EFE2CD' }}
              >
                <p className="font-hebrew font-bold text-lg" style={{ color: '#7A5A3A' }}>
                  הדרך מתבהרת
                </p>
                <p className="font-hebrew-light" style={{ color: '#7A5A3A' }}>
                  להולכים בה
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2 text-right scroll-animate fade-right">
            <h2 className="text-3xl md:text-4xl font-bold text-sage-800 mb-6 font-hebrew scroll-animate fade-up">
              נעים להכיר, שמי לימור
            </h2>
            
            <div className="space-y-6 text-sage-600 font-hebrew-light text-lg leading-relaxed scroll-animate fade-up">
              <p className="scroll-animate fade-up">
                ואני מתרגלת יוגה כבר קרוב לשני עשורים — מורה לאשטנגה ויניאסה, בת 51, שממשיכה לגלות בכל יום מחדש את העומק האינסופי של דרך העולם הזו. 
           
              </p>
              <p className="scroll-animate fade-up">
                הסטודיו שלי נולד מתוך רצון ליצור מרחב אינטימי ומעורר השראה,
                שבו כל מתרגל.ת מוזמנ.ת לפגוש את עצמו.ה בדיוק כפי שהוא.
              </p>
              <p className="scroll-animate fade-up">
                 היוגה עבורי היא לא רק תרגול פיזי, היא שער פועם, חי ונושם המזמין לעולם עשיר של תנועה, חקירה, נשימה ונוכחות.
כל שיעור שאני מעבירה הוא מסע אחר — אישי, משתנה, נוגע — שאין דומה לו.
              </p>
              
              <p className="scroll-animate fade-up">
                מתוך החיבור הזה, נולדה גם קולקציית תכשיטים שעיצבתי בהשראת עולם היוגה — עולם מושגים שלם שנישא על הגוף ומזכיר לנו, גם ביומיום, את המצפן לאבני הדרך כערכים מובילים ולאורן אני בוחרת לפסוע.
              </p>
              <p className="scroll-animate fade-up">
“היוגה אינה היעד — היא האמצעי דרכה אנו פוסעים אל עצמנו.”
              </p>
            </div>

            {/* Certifications */}
            <div className="mt-8 grid grid-cols-2 gap-4 scroll-animate fade-up">
              <div className="bg-sage-50 p-4 rounded-lg text-center scroll-animate fade-up">
                <h4 className="font-hebrew font-bold text-sage-800">מורה</h4>
                <p className="font-hebrew-light text-sage-600 text-sm mt-1">לאשטנגה, ויניאסה</p>
              </div>
              <div className="bg-sage-50 p-4 rounded-lg text-center scroll-animate fade-up">
                <h4 className="font-hebrew font-bold text-sage-800">ניסיון</h4>
                <p className="font-hebrew-light text-sage-600 text-sm mt-1">של 20 שנים</p>
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
              folder="about"
              buttonText="העלה תמונה חדשה"
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default About;

