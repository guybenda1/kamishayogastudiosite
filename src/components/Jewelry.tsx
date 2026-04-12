import React, { useEffect } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const Jewelry = () => {
  // Jewelry images - simply update this array to add more photos
  const images = [
    {
      url: '/Gemini_Generated_Image_oerrqsoerrqsoerr.webp',
      alt: 'Spiritual Jewelry Collection'
    },
    {
      url: '/Gemini_Generated_Image_999ek3999ek3999e-2-2.webp',
      alt: 'Spiritual Jewelry Collection'
    }
  ];

  useScrollAnimation();

  return (
    <section id="jewelry" className="py-20 bg-sage-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 scroll-animate fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-sage-800 mb-4 font-hebrew">
            Kamisha Jewelry Collection
          </h2>
          <p className="text-lg text-sage-600 max-w-2xl mx-auto font-hebrew-light">
            תכשיטים בעיצוב ובהשראת עולם היוגה
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 scroll-animate fade-up">
          {images.map((image, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="relative w-full h-80 md:h-96 bg-white rounded-2xl shadow-lg overflow-hidden flex items-center justify-center group">
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="eager"
                  decoding="async"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 scroll-animate fade-up">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h3 className="text-2xl md:text-3xl font-bold text-sage-800 mb-4 font-hebrew">
                עיצוב בכוונה
              </h3>
              <p className="text-gray-600 mb-6 font-hebrew-light leading-relaxed">
                כל תכשיט בקולקציה שלנו הוא היצירה שחשבנו על כל פרט בו. אנחנו משלבים אסתטיקה עדינה עם משמעות רוחנית, ויוצרים תכשיטים שהם יפים ובעלי חשיבות.
              </p>
              <p className="text-gray-600 mb-6 font-hebrew-light leading-relaxed">
                אתם מוזמנים להבחין בקולקציה המלאה שלנו, או לבקר בחנות שלנו לחוויה אישית.
              </p>
              <a
                href="https://www.kamishajewelry.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-sage-600 hover:bg-sage-700 text-white px-8 py-3 rounded-lg font-hebrew font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                לחנות התכשיטים
              </a>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="w-64 h-64 rounded-2xl shadow-lg overflow-hidden flex items-center justify-center group">
                <img
                  src="/9.webp"
                  alt="Spiritual Jewelry Collection"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="eager"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Jewelry;
