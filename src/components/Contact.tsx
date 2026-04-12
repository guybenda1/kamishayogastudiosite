import React from 'react';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import ImageUploader from './ImageUpload/ImageUploader';
import { useSiteImage } from '../hooks/useSiteImage';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const Contact = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.email === 'limorbendavid29@gmail.com' || user?.email === 'admin@kamisha.com';
  const [isEditingImage, setIsEditingImage] = React.useState(false);
  
  const { imageUrl, updateImage } = useSiteImage(
    'contact',
    'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop'
  );

  useScrollAnimation();

  return (
    <section id="contact" className="py-20 bg-sage-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 scroll-animate fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-sage-800 mb-4 font-hebrew">
            יצירת קשר
          </h2>
          <p className="text-lg text-sage-600 max-w-2xl mx-auto font-hebrew-light">
            נשמח לשמוע מכם! צרו קשר לקביעת שיעור פרטי, הצטרפות לקבוצה או כל שאלה אחרת
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Contact Info */}
          <div className="order-2 lg:order-1 text-right scroll-animate fade-right">
            <h3 className="text-2xl font-bold text-sage-800 mb-8 font-hebrew scroll-animate fade-up">
              בואו נתחבר
            </h3>
            
            <div className="space-y-6 scroll-animate fade-up">
              <div className="flex items-center space-x-4 rtl:space-x-reverse scroll-animate fade-up">
                <div className="bg-sage-100 p-3 rounded-full">
                  <Phone className="w-6 h-6 text-sage-600" />
                </div>
                <div>
                  <h4 className="font-bold text-sage-800 font-hebrew">טלפון</h4>
                  <p className="text-sage-600 font-hebrew-light">050-5172253</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 rtl:space-x-reverse scroll-animate fade-up">
                <div className="bg-sage-100 p-3 rounded-full">
                  <Mail className="w-6 h-6 text-sage-600" />
                </div>
                <div>
                  <h4 className="font-bold text-sage-800 font-hebrew">אימייל</h4>
                  <p className="text-sage-600 font-hebrew-light">limorbendavid29@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 rtl:space-x-reverse scroll-animate fade-up">
                <div className="bg-sage-100 p-3 rounded-full">
                  <MapPin className="w-6 h-6 text-sage-600" />
                </div>
                <div>
                  <h4 className="font-bold text-sage-800 font-hebrew">מיקום</h4>
                  <p className="text-sage-600 font-hebrew-light">הרותם 20, מעלה אדומים</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 rtl:space-x-reverse scroll-animate fade-up">
                <div className="bg-sage-100 p-3 rounded-full">
                  <MessageCircle className="w-6 h-6 text-sage-600" />
                </div>
                <div>
                  <h4 className="font-bold text-sage-800 font-hebrew">WhatsApp</h4>
                  <a 
                    href="https://wa.me/972505172253"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sage-600 hover:text-sage-800 font-hebrew-light transition-colors"
                  >
                    שלחו הודעה
                  </a>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-8 p-6 bg-gradient-to-br from-sage-100 to-warm-100 rounded-2xl scroll-animate fade-up">
              <h4 className="font-bold text-sage-800 mb-3 font-hebrew">
                מוכנים להתחיל?
              </h4>
              <p className="text-sage-600 font-hebrew-light mb-4">
                הצטרפו אלינו למסע של גילוי עצמי, שלווה ואיזון פנימי
              </p>
              <a
                href="https://wa.me/972505172253?text=היי לימור, אני מעוניין/ת לשמוע עוד על השיעורים"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-sage-600 hover:bg-sage-700 text-white px-6 py-3 rounded-lg font-hebrew font-medium transition-colors duration-300"
              >
                בואו נתחיל
              </a>
            </div>
          </div>

          {/* Image */}
          <div className="order-1 lg:order-2 scroll-animate fade-left">
            <div className="relative">
              <img
                src={imageUrl}
                alt="יצירת קשר - סטודיו יוגה קמישה"
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
                className="absolute -bottom-6 -left-6 p-6 rounded-2xl shadow-lg"
                style={{ backgroundColor: '#F5E4DF' }}
              >
                <p className="font-hebrew font-bold text-lg" style={{ color: '#6B4C4C' }}>
                  נשמח לשמוע מכם
                </p>
                <p className="font-hebrew-light" style={{ color: '#6B4C4C' }}>
                  בואו נתחבר
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
              folder="contact"
              buttonText="העלה תמונה חדשה"
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default Contact;