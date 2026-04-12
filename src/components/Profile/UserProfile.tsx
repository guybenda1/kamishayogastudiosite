import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, MapPin, Phone, Save, Edit, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

interface UserProfileData {
  full_name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
}

interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();

  const profileForm = useForm<UserProfileData>();
  const passwordForm = useForm<PasswordChangeData>();

  useScrollAnimation();

  useEffect(() => {
    if (user) {
      profileForm.reset({
        full_name: user.user_metadata?.full_name || '',
        email: user.email || '',
        phone: user.user_metadata?.phone || '',
        address: user.user_metadata?.address || '',
        city: user.user_metadata?.city || '',
        postal_code: user.user_metadata?.postal_code || '',
      });
    }
  }, [user, profileForm]);

  const handleUpdateProfile = async (data: UserProfileData) => {
    try {
      setLoading(true);

      const { error } = await supabase.auth.updateUser({
        email: data.email,
        data: {
          full_name: data.full_name,
          phone: data.phone,
          address: data.address,
          city: data.city,
          postal_code: data.postal_code,
        }
      });

      if (error) throw error;

      toast.success('הפרטים עודכנו בהצלחה!');
      setIsEditing(false);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error('שגיאה בעדכון הפרטים: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (data: PasswordChangeData) => {
    try {
      if (data.newPassword !== data.confirmPassword) {
        toast.error('הסיסמאות החדשות אינן תואמות');
        return;
      }

      setLoading(true);

      const { error } = await supabase.auth.updateUser({
        password: data.newPassword
      });

      if (error) throw error;

      toast.success('הסיסמה שונתה בהצלחה!');
      setIsChangingPassword(false);
      passwordForm.reset();
    } catch (error: any) {
      console.error('Error changing password:', error);
      toast.error('שגיאה בשינוי הסיסמה: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 font-hebrew">יש להתחבר כדי לצפות בפרופיל</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-warm-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 scroll-animate fade-up">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-sage-600" />
            </div>
            <h1 className="text-3xl font-bold text-sage-800 font-hebrew">הפרופיל שלי</h1>
            <p className="text-sage-600 font-hebrew-light">נהל את הפרטים האישיים שלך</p>
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 scroll-animate fade-up">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-sage-800 font-hebrew">פרטים אישיים</h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-sage-100 hover:bg-sage-200 text-sage-700 rounded-lg transition-colors font-hebrew"
            >
              <Edit className="w-4 h-4" />
              <span>{isEditing ? 'ביטול' : 'עריכה'}</span>
            </button>
          </div>

          <form onSubmit={profileForm.handleSubmit(handleUpdateProfile)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-hebrew text-right">
                  שם מלא
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    {...profileForm.register('full_name', { required: true })}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent text-right disabled:bg-gray-50 font-hebrew"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-hebrew text-right">
                  אימייל
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    {...profileForm.register('email', { required: true })}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent text-right disabled:bg-gray-50 font-hebrew"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-hebrew text-right">
                  טלפון
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    {...profileForm.register('phone')}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent text-right disabled:bg-gray-50 font-hebrew"
                    placeholder="050-1234567"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-hebrew text-right">
                  עיר
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    {...profileForm.register('city')}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent text-right disabled:bg-gray-50 font-hebrew"
                    placeholder="תל אביב"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-hebrew text-right">
                כתובת
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <textarea
                  {...profileForm.register('address')}
                  disabled={!isEditing}
                  rows={3}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent text-right disabled:bg-gray-50 font-hebrew"
                  placeholder="רחוב הרצל 123, תל אביב"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-hebrew text-right">
                מיקוד
              </label>
              <input
                type="text"
                {...profileForm.register('postal_code')}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent text-right disabled:bg-gray-50 font-hebrew"
                placeholder="12345"
              />
            </div>

            {isEditing && (
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-sage-600 hover:bg-sage-700 disabled:bg-gray-300 text-white rounded-lg font-hebrew font-medium transition-colors flex items-center space-x-2 rtl:space-x-reverse"
                >
                  <Save className="w-5 h-5" />
                  <span>{loading ? 'שומר...' : 'שמור שינויים'}</span>
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Password Change */}
        <div className="bg-white rounded-2xl shadow-lg p-8 scroll-animate fade-up">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-sage-800 font-hebrew">שינוי סיסמה</h2>
            <button
              onClick={() => setIsChangingPassword(!isChangingPassword)}
              className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-warm-100 hover:bg-warm-200 text-warm-700 rounded-lg transition-colors font-hebrew"
            >
              <Lock className="w-4 h-4" />
              <span>{isChangingPassword ? 'ביטול' : 'שנה סיסמה'}</span>
            </button>
          </div>

          {isChangingPassword && (
            <form onSubmit={passwordForm.handleSubmit(handleChangePassword)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-hebrew text-right">
                  סיסמה חדשה
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    {...passwordForm.register('newPassword', { required: true, minLength: 6 })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent text-right font-hebrew"
                    placeholder="הכנס סיסמה חדשה"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-hebrew text-right">
                  אימות סיסמה חדשה
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    {...passwordForm.register('confirmPassword', { required: true })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent text-right font-hebrew"
                    placeholder="הכנס את הסיסמה שוב"
                  />
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-warm-600 hover:bg-warm-700 disabled:bg-gray-300 text-white rounded-lg font-hebrew font-medium transition-colors flex items-center space-x-2 rtl:space-x-reverse"
                >
                  <Lock className="w-5 h-5" />
                  <span>{loading ? 'משנה...' : 'שנה סיסמה'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;