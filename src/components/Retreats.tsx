import React, { useState } from 'react';
import { Mountain, Users, Heart, Calendar, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import ImageUploader from './ImageUpload/ImageUploader';
import { useSiteImage } from '../hooks/useSiteImage';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const Retreats = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuthStore();
  const isAdmin = user?.email === 'limorbendavid29@gmail.com' || user?.email === 'admin@kamisha.com';
  const [editingImageIndex, setEditingImageIndex] = React.useState<number | null>(null);

  // Use hooks for each retreat image
  const { imageUrl: image0, updateImage: updateImage0 } = useSiteImage('retreats-0', 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop');
  const { imageUrl: image1, updateImage: updateImage1 } = useSiteImage('retreats-1', 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop');
  const { imageUrl: image2, updateImage: updateImage2 } = useSiteImage('retreats-2', 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop');
  
  const retreatImages = [image0, image1, image2];
  const updateFunctions = [updateImage0, updateImage1, updateImage2];

  useScrollAnimation();

  return (
    <section id="retreats" className="py-20 bg-gradient-to-br from-warm-50 to-sage-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 scroll-animate fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-sage-800 mb-4 font-hebrew">
            Reborn Retreats
          </h2>
          <p className="text-lg text-sage-600 max-w-2xl mx-auto font-hebrew-light">
            מסעות העמקה בטבע המשלבים תרגול יוגה, מדיטציה וחיבור עמוק לעצמנו ולסביבה
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="order-2 lg:order-1 text-right scroll-animate fade-right">
            <div className="space-y-6 text-sage-600 font-hebrew-light text-lg leading-relaxed scroll-animate fade-up">
              <p className="scroll-animate fade-up">
                הריטריטים שאני יוצרת מפיקה הם מסעות עומק מרתקים אל עולמות הגוף, הנפש 
והמיינד. הם משלבים תרגולי יוגה מגוונים, סדנאות קונספט, פילוסופיה, פרניאמה, צלילים מרפאים ומגוון סדנאות חיצוניות. 
              </p>
              <p className="scroll-animate fade-up">
                הכל מתחיל במרחבים שנבחרים בקפידה, עטופים בטבע, באסתטיקה מוקפדת,
באוכל איכותי ומשובח. 
              </p>
              <p className="scroll-animate fade-up">
               חוויה שלמה עוטפת מחברת ומזינה שממשיכה להדהד ולהשפיע עוד זמן רב לאחר שהסתיימה.
              </p>
            </div>

            {/* Features */}
            <div className="mt-8 grid grid-cols-2 gap-4 scroll-animate fade-up">
              <div className="flex items-center space-x-3 rtl:space-x-reverse scroll-animate fade-up">
                <div className="bg-green-100 p-2 rounded-full">
                  <Mountain className="w-5 h-5 text-green-600" />
                </div>
                <span className="font-hebrew text-sage-700">במרחבים טבעיים</span>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse scroll-animate fade-up">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <span className="font-hebrew text-sage-700">קבוצות אינטימיות</span>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse scroll-animate fade-up">
                <div className="bg-warm-200 p-2 rounded-full">
                  <Heart className="w-5 h-5 text-warm-700" />
                </div>
                <span className="font-hebrew text-sage-700">חוויה הוליסטית</span>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse scroll-animate fade-up">
                <div className="bg-purple-100 p-2 rounded-full">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <span className="font-hebrew text-sage-700">מספר פעמים בשנה</span>
              </div>
            </div>

            <div className="mt-8">
             
            </div>
          </div>

          {/* Images */}
          <div className="order-1 lg:order-2 scroll-animate fade-left">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative scroll-animate fade-up">
                  <img
                    src={retreatImages[0]}
                    alt="ריטריט יוגה בטבע"
                    className="rounded-2xl shadow-lg w-full h-48 object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  {isAdmin && (
                    <button
                      onClick={() => setEditingImageIndex(0)}
                      className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                      title="עדכן תמונה"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  )}
                </div>
                <div className="relative scroll-animate fade-up">
                  <img
                    src={retreatImages[1]}
                    alt="מדיטציה בקבוצה"
                    className="rounded-2xl shadow-lg w-full h-32 object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  {isAdmin && (
                    <button
                      onClick={() => setEditingImageIndex(1)}
                      className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                      title="עדכן תמונה"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-8">
                <div className="relative scroll-animate fade-up">
                  <img
                    src={retreatImages[2]}
                    alt="תרגול יוגה בחוץ"
                    className="rounded-2xl shadow-lg w-full h-64 object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  {isAdmin && (
                    <button
                      onClick={() => setEditingImageIndex(2)}
                      className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                      title="עדכן תמונה"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* מודל עריכת תמונה */}
      {editingImageIndex !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setEditingImageIndex(null)}
              className="absolute top-4 left-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-sage-800 font-hebrew">
                עדכן תמונת ריטריט
              </h2>
            </div>

            <ImageUploader
              onImageUploaded={(url) => {
                updateFunctions[editingImageIndex](url);
                setEditingImageIndex(null);
              }}
              folder="retreats"
              buttonText="העלה תמונה חדשה"
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default Retreats;