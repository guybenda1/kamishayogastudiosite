import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Star, User } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
  image: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

const TestimonialsAdmin = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [loading, setLoading] = useState(true);

  useScrollAnimation();

  const emptyTestimonial: Omit<Testimonial, 'id' | 'created_at'> = {
    name: '',
    text: '',
    rating: 5,
    image: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    is_active: true,
    sort_order: 0,
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      // Try to fetch from database first
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error && error.code === '42P01') {
        // Table doesn't exist, create it
        await createTestimonialsTable();
        // Load default testimonials
        setTestimonials(getDefaultTestimonials());
      } else if (error) {
        throw error;
      } else {
        setTestimonials(data || []);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      // Fallback to default testimonials
      setTestimonials(getDefaultTestimonials());
    } finally {
      setLoading(false);
    }
  };

  const createTestimonialsTable = async () => {
    try {
      const { error } = await supabase.rpc('create_testimonials_table');
      if (error) throw error;
    } catch (error) {
      console.error('Error creating testimonials table:', error);
    }
  };

  const getDefaultTestimonials = (): Testimonial[] => [
    {
      id: '1',
      name: "גודי א.",
      text: "מקצועיות ברמה אחרת!!!!! אושר עילאי כשנכנסים לסטודיו אווירה רגועה הנאה שחרור ...סוג הספורט היחיד שאני מוכנה לתרגל רק בגלל סטודיו קמישה והמורה המדהימה שאין כמותה ולא תהיה !!!",
      rating: 5,
      image: "https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      is_active: true,
      sort_order: 1,
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      name: "גליה ע.",
      text: "לימורי אישה מאוד מיוחדת, העברת היוגה בדרך טובה ונעימה, מקצועית, לצאת מהיוגה של לימור זה להתחדש במלוא האנרגיה הדרושה. פשוט כיף להגיע, לחוות ולהתמלא מחדש! תודה את אישה מהממת! ואין על שיעורי היוגה שלך",
      rating: 5,
      image: "https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      is_active: true,
      sort_order: 2,
      created_at: new Date().toISOString()
    },
    {
      id: '3',
      name: "מוריה פ.",
      text: "מדריכה מדהימה. אימון מקצועי לגוף ולנפש",
      rating: 5,
      image: "https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      is_active: true,
      sort_order: 3,
      created_at: new Date().toISOString()
    }
  ];

  const handleSaveTestimonial = async (testimonialData: Omit<Testimonial, 'id' | 'created_at'> & { id?: string }) => {
    try {
      if (testimonialData.id) {
        // Update existing testimonial
        const { error } = await supabase
          .from('testimonials')
          .update(testimonialData)
          .eq('id', testimonialData.id);

        if (error) throw error;
        toast.success('הביקורת עודכנה בהצלחה');
      } else {
        // Create new testimonial
        const { error } = await supabase
          .from('testimonials')
          .insert([{
            ...testimonialData,
            sort_order: testimonials.length + 1
          }]);

        if (error) throw error;
        toast.success('הביקורת נוספה בהצלחה');
      }

      setEditingTestimonial(null);
      setIsAddingNew(false);
      fetchTestimonials();
    } catch (error) {
      console.error('Error saving testimonial:', error);
      toast.error('שגיאה בשמירת הביקורת');
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק את הביקורת?')) return;

    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('הביקורת נמחקה בהצלחה');
      fetchTestimonials();
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast.error('שגיאה במחיקת הביקורת');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600 mx-auto mb-4"></div>
          <p className="text-sage-600 font-hebrew">טוען ביקורות...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-8 scroll-animate fade-up">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-sage-800 font-hebrew mb-2">
            💬 ניהול ביקורות מתרגלים
          </h2>
          <p className="text-sage-600 font-hebrew-light text-lg">
            נהל את הביקורות שמופיעות בעמוד הבית
          </p>
        </div>
        
        <div className="flex justify-center">
          <button
            onClick={() => setIsAddingNew(true)}
            className="bg-gradient-to-r from-warm-600 to-warm-700 hover:from-warm-700 hover:to-warm-800 text-white px-8 py-4 rounded-2xl font-hebrew font-bold text-lg flex items-center space-x-3 rtl:space-x-reverse shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            <Plus className="w-6 h-6" />
            <span>➕ הוסף ביקורת חדשה</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl text-center">
            <div className="text-3xl font-bold text-blue-600 font-hebrew">
              {testimonials.length}
            </div>
            <div className="text-blue-800 font-hebrew font-medium">ביקורות כולל</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl text-center">
            <div className="text-3xl font-bold text-green-600 font-hebrew">
              {testimonials.filter(t => t.is_active).length}
            </div>
            <div className="text-green-800 font-hebrew font-medium">ביקורות פעילות</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl text-center">
            <div className="text-3xl font-bold text-yellow-600 font-hebrew">
              {testimonials.length > 0 ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1) : '5.0'}
            </div>
            <div className="text-yellow-800 font-hebrew font-medium">דירוג ממוצע</div>
          </div>
        </div>
      </div>

      {/* Add/Edit Form */}
      {(isAddingNew || editingTestimonial) && (
        <div className="bg-white rounded-2xl shadow-lg p-8 scroll-animate fade-up">
          <TestimonialForm
            testimonial={editingTestimonial || emptyTestimonial}
            onSave={handleSaveTestimonial}
            onCancel={() => {
              setIsAddingNew(false);
              setEditingTestimonial(null);
            }}
          />
        </div>
      )}

      {/* Testimonials List */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden scroll-animate fade-up">
        <div className="bg-gradient-to-r from-warm-600 to-warm-700 p-6">
          <h3 className="text-2xl font-bold text-white font-hebrew text-center">
            📋 רשימת הביקורות
          </h3>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-gradient-to-br from-sage-50 to-warm-50 p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow scroll-animate fade-up">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover ml-3"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="text-right flex-1">
                    <h4 className="font-bold text-sage-800 font-hebrew">
                      {testimonial.name}
                    </h4>
                    <div className="flex justify-end mt-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                
                <blockquote className="text-sage-700 font-hebrew-light text-right leading-relaxed italic mb-4 line-clamp-3">
                  "{testimonial.text}"
                </blockquote>
                
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <button
                      onClick={() => setEditingTestimonial(testimonial)}
                      className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-colors"
                      title="ערוך ביקורת"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTestimonial(testimonial.id)}
                      className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
                      title="מחק ביקורת"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className={`px-2 py-1 rounded-full text-xs font-hebrew ${
                      testimonial.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {testimonial.is_active ? 'פעיל' : 'לא פעיל'}
                    </span>
                    <span className="text-xs text-gray-500 font-hebrew">
                      #{testimonial.sort_order}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {testimonials.length === 0 && (
            <div className="text-center py-12">
              <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-600 font-hebrew mb-2">אין ביקורות עדיין</h3>
              <p className="text-gray-500 font-hebrew-light">הוסף ביקורת ראשונה כדי להתחיל</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface TestimonialFormProps {
  testimonial: Omit<Testimonial, 'id' | 'created_at'> & { id?: string };
  onSave: (testimonial: Omit<Testimonial, 'id' | 'created_at'> & { id?: string }) => void;
  onCancel: () => void;
}

const TestimonialForm: React.FC<TestimonialFormProps> = ({ testimonial, onSave, onCancel }) => {
  const [formData, setFormData] = useState(testimonial);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-sage-800 mb-2 font-hebrew">
          {testimonial.id ? 'עריכת ביקורת' : 'הוספת ביקורת חדשה'}
        </h3>
        <p className="text-sage-600 font-hebrew-light">
          {testimonial.id ? 'ערוך את פרטי הביקורת' : 'הוסף ביקורת חדשה של מתרגל'}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-base font-bold text-sage-800 mb-3 font-hebrew text-right">
              שם המתרגל
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-sage-500 text-right font-hebrew transition-all"
              placeholder="שם פרטי + ראשי תיבה של שם משפחה"
              required
            />
          </div>

          <div>
            <label className="block text-base font-bold text-sage-800 mb-3 font-hebrew text-right">
              דירוג
            </label>
            <select
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-sage-500 text-right font-hebrew transition-all"
            >
              {[5, 4, 3, 2, 1].map(rating => (
                <option key={rating} value={rating}>
                  {rating} כוכבים {'★'.repeat(rating)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-base font-bold text-sage-800 mb-3 font-hebrew text-right">
              סדר הצגה
            </label>
            <input
              type="number"
              value={formData.sort_order}
              onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-sage-500 text-right font-hebrew transition-all"
              placeholder="1, 2, 3..."
              min="1"
            />
          </div>

          <div>
            <label className="block text-base font-bold text-sage-800 mb-3 font-hebrew text-right">
              קישור לתמונה
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-sage-500 text-right font-hebrew transition-all"
              placeholder="https://..."
            />
          </div>
        </div>

        <div>
          <label className="block text-base font-bold text-sage-800 mb-3 font-hebrew text-right">
            טקסט הביקורת
          </label>
          <textarea
            value={formData.text}
            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-sage-500 text-right font-hebrew transition-all"
            placeholder="כתוב כאן את הביקורת של המתרגל..."
            required
          />
        </div>

        <div className="flex items-center justify-center p-4 bg-sage-50 rounded-xl">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-5 h-5 rounded border-gray-300 text-sage-600 focus:ring-sage-500"
            />
            <span className="mr-3 text-base font-medium text-sage-800 font-hebrew">ביקורת פעילה</span>
          </label>
        </div>

        <div className="flex justify-center space-x-4 rtl:space-x-reverse pt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-8 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-hebrew font-medium transition-all flex items-center space-x-2 rtl:space-x-reverse"
          >
            <X className="w-5 h-5" />
            <span>ביטול</span>
          </button>
          <button
            type="submit"
            className="px-8 py-3 bg-gradient-to-r from-warm-600 to-warm-700 hover:from-warm-700 hover:to-warm-800 text-white rounded-xl font-hebrew font-bold transition-all flex items-center space-x-2 rtl:space-x-reverse shadow-lg"
          >
            <Save className="w-5 h-5" />
            <span>שמור ביקורת</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default TestimonialsAdmin;