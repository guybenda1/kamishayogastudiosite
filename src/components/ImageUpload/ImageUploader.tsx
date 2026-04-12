import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface ImageUploaderProps {
  onImageUploaded: (url: string) => void;
  currentImage?: string;
  folder?: string;
  className?: string;
  buttonText?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUploaded,
  currentImage,
  folder = 'uploads',
  className = '',
  buttonText = 'העלה תמונה'
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImage = (file: File, maxWidth: number = 600, quality: number = 0.7): Promise<File> => {
    return new Promise((resolve) => {
      // If file is already small, don't process
      if (file.size < 200 * 1024) {
        resolve(file);
        return;
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        let { width, height } = img;
        
        // Resize if too large
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          const fileName = file.name.replace(/\.[^/.]+$/, '.webp');
          const processedFile = new File([blob!], fileName, {
            type: 'image/webp',
            lastModified: Date.now(),
          });
          resolve(processedFile);
        }, 'image/webp', quality);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const uploadImage = async (file: File) => {
    try {
      setUploading(true);
      
      // Process image to reduce size
      const processedFile = await processImage(file);

      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.webp`;
      const filePath = `${folder}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(filePath, processedFile, {
          cacheControl: '31536000',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('photos')
        .getPublicUrl(filePath);

      if (data?.publicUrl) {
        onImageUploaded(data.publicUrl);
        toast.success('התמונה הועלתה בהצלחה!');
      }

    } catch (error: any) {
      toast.error('שגיאה בהעלאת התמונה: ' + (error.message || 'שגיאה לא ידועה'));
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadImage(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      uploadImage(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* אזור העלאה */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver
            ? 'border-sage-500 bg-sage-50'
            : 'border-gray-300 hover:border-sage-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />

        {uploading ? (
          <div className="flex flex-col items-center">
            <Loader className="w-8 h-8 text-sage-600 animate-spin mb-2" />
            <p className="text-sage-600 font-hebrew">מעלה תמונה...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <ImageIcon className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2 font-hebrew">גרור תמונה לכאן או</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-sage-600 hover:bg-sage-700 text-white px-4 py-2 rounded-lg font-hebrew transition-colors"
            >
              {buttonText}
            </button>
            <p className="text-xs text-gray-500 mt-2 font-hebrew-light">
              JPG, PNG, GIF, WebP
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;