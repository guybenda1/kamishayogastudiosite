import React, { useState } from 'react';
import { Plus, Upload, X, Image as ImageIcon, Image as Images } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import ImageUploader from './ImageUploader';
import MultipleImageUploader from './MultipleImageUploader';
import toast from 'react-hot-toast';

interface GalleryImageUploaderProps {
  onImagesAdded: (urls: string[]) => void;
}

const GalleryImageUploader: React.FC<GalleryImageUploaderProps> = ({ onImagesAdded }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMultipleMode, setIsMultipleMode] = useState(false);
  const { user } = useAuthStore();

  // בדיקה אם המשתמש הוא אדמין
  const isAdmin = user?.email === 'limorbendavid29@gmail.com' || user?.email === 'admin@kamisha.com';

  const handleImageUploaded = (url: string) => {
    if (url) {
      onImagesAdded([url]);
      toast.success('התמונה נוספה לגלריה!');
      setIsOpen(false);
    }
  };

  const handleMultipleImagesUploaded = (urls: string[]) => {
    if (urls.length > 0) {
      onImagesAdded(urls);
      toast.success(`${urls.length} תמונות נוספו לגלריה!`);
      setIsOpen(false);
      setIsMultipleMode(false);
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <>
      {/* כפתור הוספת תמונה לגלריה */}
      <div className="fixed bottom-4 left-4 z-40">
        <div className="flex flex-col space-y-2">
          <button
            onClick={() => {
              setIsMultipleMode(false);
              setIsOpen(true);
            }}
            className="bg-sage-600 hover:bg-sage-700 text-white p-3 rounded-full shadow-lg transition-colors"
            title="הוסף תמונה אחת"
          >
            <Plus className="w-6 h-6" />
          </button>
          <button
            onClick={() => {
              setIsMultipleMode(true);
              setIsOpen(true);
            }}
            className="bg-warm-500 hover:bg-warm-600 text-white p-3 rounded-full shadow-lg transition-colors"
            title="הוסף מספר תמונות"
          >
            <Images className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* מודל העלאת תמונה */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 left-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-sage-800 font-hebrew">
                {isMultipleMode ? 'הוסף תמונות לגלריה' : 'הוסף תמונה לגלריה'}
              </h2>
              <p className="text-gray-600 font-hebrew-light mt-2">
                {isMultipleMode 
                  ? 'העלה מספר תמונות שיופיעו בגלריית האתר'
                  : 'העלה תמונה חדשה שתופיע בגלריית האתר'
                }
              </p>
            </div>

            {isMultipleMode ? (
              <MultipleImageUploader
                onImagesUploaded={handleMultipleImagesUploaded}
                folder="gallery"
                buttonText="העלה תמונות לגלריה"
                maxImages={10}
              />
            ) : (
              <ImageUploader
                onImageUploaded={handleImageUploaded}
                folder="gallery"
                buttonText="העלה תמונה לגלריה"
              />
            )}

            <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800 font-hebrew-light">
                💡 לאחר העלאת התמונות, יש לעדכן את קוד הגלריה כדי שהתמונות יופיעו באתר
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GalleryImageUploader;