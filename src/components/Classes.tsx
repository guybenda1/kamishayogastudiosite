import React from 'react';
import { useAuthStore } from '../store/authStore';
import ImageUploader from './ImageUpload/ImageUploader';
import { useSiteImage } from '../hooks/useSiteImage';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const Classes = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.email === 'limorbendavid29@gmail.com' || user?.email === 'admin@kamisha.com';
  const [editingImageIndex, setEditingImageIndex] = React.useState<number | null>(null);
  
  // Use hooks for each class image
  const { imageUrl: image0, updateImage: updateImage0 } = useSiteImage('classes-0', 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop');
  const { imageUrl: image1, updateImage: updateImage1 } = useSiteImage('classes-1', 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop');
  const { imageUrl: image2, updateImage: updateImage2 } = useSiteImage('classes-2', 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop');
  const { imageUrl: image3, updateImage: updateImage3 } = useSiteImage('classes-3', 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop');
  
  const classImages = [image0, image1, image2, image3];
  const updateFunctions = [updateImage0, updateImage1, updateImage2, updateImage3];

  useScrollAnimation();

  const classes = [
    {
      title: "תרגולים קבוצתיים",
      description: "שיעורי אשטנגה וויניאסה יוגה במרחב הסטודיו האינטימי",
      duration: "75 דקות",
      level: "כל הרמות",
      image: classImages[0],
      details: "שיעורי יוגה קבועים בסטודיו עם אווירה אינטימית ומעוררת השראה"
    },
    {
      title: "תרגולים אישיים",
      description: "תרגול אישי 1:1 מותאם למידותייך עם התאמות אישיות",
      duration: "60 דקות",
      level: "מותאם אישית",
      image: classImages[1],
      details: "מציעה בנוסף לתרגולי הסטודיו שבשגרה, תרגול אישי 1:1, מותאם למידותייך, עם מתן דגשים והתאמות."
    },
    {
      title: "ליווי גוף נפש",
      description: "תהליך ליווי התפתחות ושינוי ייחודי של חמישה מפגשים",
      duration: "5 מפגשים",
      level: "אישי",
      image: classImages[2],
      details: "הגוף הוא מראה לנפש. ככל שאנחנו לומדות להקשיב לגוף, אנחנו מאפשרות התמרה של דפוסים מגבילים, אמונות ומתח. ליווי בתהליך מאפשר בהירות, שחרור, וריפוי פנימי עמוק. כל תהליך מוצא את דרכו פנימה נינוח וחסר מאמץ ובעיקר אפשרי."
    },
    {
      title: "מפגשי העמקה וסדנאות",
      description: "למי שכבר הבין שיש הרבה מעבר לאסאנות - אסופה מרתקת של ידע ותרגול וסדנאות העמקה בנושאים ספציפיים ומסעות העמקה בטבע",
      duration: "4 מפגשים",
      level: "כל הרמות",
      image: classImages[3],
      details: "למי שכבר הבין שיש הרבה מעבר לאסאנות, למי שעולם היוגה מעורר בו סקרנות, למי שמבקש לגלות, להעמיק ולהרחיב עוד רובד, אני מציעה ומנגישה את הידע ברוח היוגה מנקודת המבט שלי. באסופה מרתקת בת ארבעה מפגשים המורכבים מהפילוסופיה והחיבור אל היום-יום ותרגול יוגה תומך. סאנגה במיטבה! אני לא משתמשת בגוף כדי להגיע לאסאנה, אני משתמשת באסאנה כדי להגיע לתוך הגוף. בנוסף, סדנאות מיוחדות להעמקת הידע והתרגול בתחומים שונים של היוגה, וחוויות מעמיקות בטבע המשלבות תרגול יוגה עם חיבור לסביבה הטבעית"
    }
  ];

  return (
    <section id="classes" className="py-20 bg-sage-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 scroll-animate fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-sage-800 mb-4 font-hebrew">
            השיעורים והפעילויות שלי
          </h2>
          <p className="text-lg text-sage-600 max-w-2xl mx-auto font-hebrew-light">
            מגוון רחב של התמחויות - תרגולי יוגה קבוצתיים ואישיים, סדנאות, ריטריטים וליווי תהליכי התפתחות גופנפש
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {classes.map((classItem, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden h-full flex flex-col scroll-animate fade-up">
              <div className="relative h-48">
                <img
                  src={classItem.image}
                  alt={classItem.title}
                  className="w-full h-full object-cover"
                  style={index === 3 ? { objectPosition: 'center top 15%' } : {}}
                  loading="lazy"
                  decoding="async"
                />
                {isAdmin && (
                  <button
                    onClick={() => setEditingImageIndex(index)}
                    className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    title="עדכן תמונה"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                )}
              </div>

              <div className="p-6 text-right flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-sage-800 mb-2 font-hebrew">
                  {classItem.title}
                </h3>

                <p className="text-sage-600 mb-4 font-hebrew-light leading-relaxed flex-1">
                  {classItem.description}
                </p>

                <div className="flex justify-between items-center mb-4 text-sm">
                  <span className="px-3 py-1 rounded-full font-hebrew-light" style={{ backgroundColor: '#F5E4DF', color: '#6B4C4C' }}>
                    {classItem.level}
                  </span>
                  <span className="text-sage-600 font-hebrew-light">
                    {classItem.duration}
                  </span>
                </div>

                <div className="mb-4">
                  <details className="group">
                    <summary className="cursor-pointer text-sage-700 font-hebrew font-medium hover:text-sage-800 transition-colors">
                      פרטים נוספים
                    </summary>
                    <div className="mt-3 p-4 bg-sage-50 rounded-lg">
                      <p className="text-sage-600 font-hebrew-light text-sm leading-relaxed">
                        {classItem.details}
                      </p>
                    </div>
                  </details>
                </div>

                {/* כפתורים */}
                {index === 0 && (
                  <a href="https://wa.me/972505172253?text=היי לימור, אני מעוניין/ת בתרגולים קבוצתיים. אשמח לקבל פרטים נוספים"
                    target="_blank" rel="noopener noreferrer"
                    className="w-full text-center py-3 rounded-lg font-hebrew font-medium mt-auto"
                    style={{ backgroundColor: '#F5E4DF', color: '#6B4C4C' }}>
                    הזמני מקום בתרגול קבוצתי
                  </a>
                )}
                {index === 1 && (
                  <a href="https://wa.me/972505172253?text=היי לימור, אני מעוניין/ת בתרגול אישי 1:1. אשמח לתאם פגישה"
                    target="_blank" rel="noopener noreferrer"
                    className="w-full text-center py-3 rounded-lg font-hebrew font-medium mt-auto"
                    style={{ backgroundColor: '#F5E4DF', color: '#6B4C4C' }}>
                    תאמי תרגול אישי
                  </a>
                )}
                {index === 2 && (
                  <a href="https://wa.me/972505172253?text=היי לימור, אני מעוניין/ת בתהליך ליווי גוף-נפש. אשמח לשמוע פרטים נוספים"
                    target="_blank" rel="noopener noreferrer"
                    className="w-full text-center py-3 rounded-lg font-hebrew font-medium mt-auto"
                    style={{ backgroundColor: '#F5E4DF', color: '#6B4C4C' }}>
                    התחילי תהליך ליווי
                  </a>
                )}
                {index === 3 && (
                  <a href="https://wa.me/972505172253?text=היי לימור, אני מעוניין/ת במפגשי העמקה וסדנאות. אשמח לקבל עדכונים על הפעילויות הקרובות"
                    target="_blank" rel="noopener noreferrer"
                    className="w-full text-center py-3 rounded-lg font-hebrew font-medium mt-auto"
                    style={{ backgroundColor: '#F5E4DF', color: '#6B4C4C' }}>
                    הירשמי לעדכונים
                  </a>
                )}
              </div>
            </div>
          ))}
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
                עדכן תמונת שיעור
              </h2>
            </div>

            <ImageUploader
              onImageUploaded={(url) => {
                updateFunctions[editingImageIndex](url);
                setEditingImageIndex(null);
              }}
              folder="classes"
              buttonText="העלה תמונה חדשה"
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default Classes;