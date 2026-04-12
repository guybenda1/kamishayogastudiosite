import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const defaultTestimonials = [
    {
      id: '1',
      name: "גודי א.",
      text: "מקצועיות ברמה אחרת!!!!! אושר עילאי כשנכנסים לסטודיו אווירה רגועה הנאה שחרור ...סוג הספורט היחיד שאני מוכנה לתרגל רק בגלל סטודיו קמישה והמורה המדהימה שאין כמותה ולא תהיה !!!",
      rating: 5,
      image: "https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
    },
    {
      id: '2',
      name: "גליה ע.",
      text: "לימורי אישה מאוד מיוחדת, העברת היוגה בדרך טובה ונעימה, מקצועית, לצאת מהיוגה של לימור זה להתחדש במלוא האנרגיה הדרושה. פשוט כיף להגיע, לחוות ולהתמלא מחדש! תודה את אישה מהממת! ואין על שיעורי היוגה שלך",
      rating: 5,
      image: "https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
    },
    {
      id: '3',
      name: "מוריה פ.",
      text: "מדריכה מדהימה. אימון מקצועי לגוף ולנפש",
      rating: 5,
      image: "https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
    },
    {
      id: '4',
      name: "מירב ח.",
      text: "לימוד מהממת, נותנת יחס אישי. החוויה בכל שיעור עוצמתית.",
      rating: 5,
      image: "https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
    },
    {
      id: '5',
      name: "רינת ע.",
      text: "לימורי מיוחדת! הכי מקצועית בתחום! סטודיו מושלם, אווירה מדהימה! הכי מומלצת!",
      rating: 5,
      image: "https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
    },
    {
      id: '6',
      name: "שירן א.",
      text: "וואו, סטודיו שמשלב תרגול יוגה לצד תחושת רגיעה וסיפוק אינסופי! לימור המהממת דואגת לכל פרט ופרט ולא מחסירה מהמתרגלות כלום! מחכה כל פעם מחדש לקראת התרגול. מומלץ בחום!!!!",
      rating: 5,
      image: "https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
    }
  ];

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Error fetching testimonials:', error);
        setTestimonials(defaultTestimonials);
      } else {
        setTestimonials(data && data.length > 0 ? data : defaultTestimonials);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      setTestimonials(defaultTestimonials);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + 3 >= testimonials.length ? 0 : prevIndex + 3
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? Math.max(0, testimonials.length - 3) : Math.max(0, prevIndex - 3)
    );
  };

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  const visibleTestimonials = testimonials.slice(currentIndex, currentIndex + 3);

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600 mx-auto mb-4"></div>
            <p className="text-sage-600 font-hebrew">טוען ביקורות...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-sage-800 mb-4 font-hebrew">
            מתרגלים מספרים
          </h2>
          <p className="text-lg text-sage-600 max-w-2xl mx-auto font-hebrew-light">
            עדויות ממתרגלים שחוו את הכוח המרפא של היוגה במרחב שלנו
          </p>
        </div>

        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-300"
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="w-6 h-6 text-sage-600" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-300"
            disabled={currentIndex + 3 >= testimonials.length}
          >
            <ChevronRight className="w-6 h-6 text-sage-600" />
          </button>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-12">
            {visibleTestimonials.map((testimonial, index) => (
              <div key={testimonial.id || currentIndex + index} className="bg-gradient-to-br from-sage-50 to-warm-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover ml-4"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="text-right">
                    <h4 className="font-bold text-sage-800 font-hebrew text-lg">
                      {testimonial.name}
                    </h4>
                    <div className="flex justify-end mt-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i} className="text-warm-500 text-lg">★</span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <blockquote className="text-sage-700 font-hebrew-light text-right leading-relaxed italic">
                  "{testimonial.text}"
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;