import React, { useState } from 'react';
import { X, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SignInForm {
  email: string;
  password: string;
}

interface SignUpForm {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface ForgotPasswordForm {
  email: string;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const { signIn, signUp } = useAuthStore();

  const signInForm = useForm<SignInForm>();
  const signUpForm = useForm<SignUpForm>();
  const forgotPasswordForm = useForm<ForgotPasswordForm>();

  const handleSignIn = async (data: SignInForm) => {
    const { error } = await signIn(data.email, data.password);
    
    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        toast.error('אימייל או סיסמה שגויים. אנא בדוק את הפרטים ונסה שוב.');
      } else if (error.message.includes('Email not confirmed')) {
        toast.error('יש לאמת את כתובת האימייל לפני ההתחברות.');
      } else {
        toast.error('שגיאה בהתחברות: ' + error.message);
      }
    } else {
      toast.success('התחברת בהצלחה!');
      onClose();
    }
  };

  const handleSignUp = async (data: SignUpForm) => {
    if (data.password !== data.confirmPassword) {
      toast.error('הסיסמאות אינן תואמות');
      return;
    }

    const { error } = await signUp(data.email, data.password, data.fullName);
    
    if (error) {
      if (error.message.includes('User already registered')) {
        toast.error('משתמש עם אימייל זה כבר קיים במערכת.');
      } else if (error.message.includes('Password should be at least')) {
        toast.error('הסיסמה חייבת להכיל לפחות 6 תווים.');
      } else {
        toast.error('שגיאה ברישום: ' + error.message);
      }
    } else {
      toast.success('נרשמת בהצלחה!');
      onClose();
    }
  };

  const handleForgotPassword = async (data: ForgotPasswordForm) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast.error('שגיאה בשליחת אימייל איפוס: ' + error.message);
      } else {
        toast.success('נשלח אימייל עם קישור לאיפוס סיסמה!');
        setIsForgotPassword(false);
      }
    } catch (error) {
      toast.error('שגיאה בשליחת אימייל איפוס');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-sage-800 font-hebrew">
            {isForgotPassword ? 'איפוס סיסמה' : isSignUp ? 'הרשמה' : 'התחברות'}
          </h2>
        </div>

        {isForgotPassword ? (
          <form onSubmit={forgotPasswordForm.handleSubmit(handleForgotPassword)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-hebrew text-right">
                אימייל
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  {...forgotPasswordForm.register('email', { required: true })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent text-right"
                  placeholder="הכנס את האימייל שלך"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-sage-600 hover:bg-sage-700 text-white py-3 rounded-lg font-hebrew font-medium transition-colors"
            >
              שלח קישור איפוס
            </button>

            <button
              type="button"
              onClick={() => setIsForgotPassword(false)}
              className="w-full flex items-center justify-center space-x-2 rtl:space-x-reverse text-sage-600 hover:text-sage-700 font-hebrew text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>חזור להתחברות</span>
            </button>
          </form>
        ) : !isSignUp ? (
          <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-hebrew text-right">
                אימייל
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  {...signInForm.register('email', { required: true })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent text-right"
                  placeholder="הכנס את האימייל שלך"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-hebrew text-right">
                סיסמה
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  {...signInForm.register('password', { required: true })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent text-right"
                  placeholder="הכנס את הסיסמה שלך"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-sage-600 hover:bg-sage-700 text-white py-3 rounded-lg font-hebrew font-medium transition-colors"
            >
              התחבר
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsForgotPassword(true)}
                className="text-sage-600 hover:text-sage-700 font-hebrew text-sm underline"
              >
                שכחתי סיסמה
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-hebrew text-right">
                שם מלא
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  {...signUpForm.register('fullName', { required: true })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent text-right"
                  placeholder="הכנס את שמך המלא"
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
                  {...signUpForm.register('email', { required: true })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent text-right"
                  placeholder="הכנס את האימייל שלך"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-hebrew text-right">
                סיסמה
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  {...signUpForm.register('password', { required: true })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent text-right"
                  placeholder="הכנס סיסמה"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-hebrew text-right">
                אימות סיסמה
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  {...signUpForm.register('confirmPassword', { required: true })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent text-right"
                  placeholder="הכנס את הסיסמה שוב"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-sage-600 hover:bg-sage-700 text-white py-3 rounded-lg font-hebrew font-medium transition-colors"
            >
              הירשם
            </button>
          </form>
        )}

        {!isForgotPassword && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sage-600 hover:text-sage-700 font-hebrew text-sm"
            >
              {isSignUp ? 'כבר יש לך חשבון? התחבר' : 'אין לך חשבון? הירשם'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;