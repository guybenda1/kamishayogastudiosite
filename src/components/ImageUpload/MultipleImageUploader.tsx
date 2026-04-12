import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface MultipleImageUploaderProps {
  onImagesUploaded: (urls: string[]) => void;
  folder?: string;
  className?: string;
  buttonText?: string;
  maxImages?: number;
}

const MultipleImageUploader: React.FC<MultipleImageUploaderProps> = ({
  onImagesUploaded,
  folder = 'uploads',
  className = '',
  buttonText = 'העלה תמונות',
  maxImages = 10
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImage = (file: File, maxWidth: number = 800, quality: number = 0.8): Promise<File> => {
    return new Promise((resolve) => {
      if (file.size < 500 * 1024) {
        resolve(file);
        return;
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        let { width, height } = img;
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

  const uploadImages = async (files: FileList) => {
    try {
      setUploading(true);
      const uploadedUrls: string[] = [];
      const fileArray = Array.from(files).slice(0, maxImages);

      if (fileArray.length === 0) return;

      for (const file of fileArray) {
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} אינו קובץ תמונה`);
          return;
        }
      }

      for (let i = 0; i < fileArray.length; i++) {
        let file = fileArray[i];
        const processedFile = await processImage(file);
        
        const fileExtension = processedFile.name.split('.').pop();
        const fileName = `${Date.now()}-${i}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
        const filePath = `${folder}/${fileName}`;

        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));

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
          uploadedUrls.push(data.publicUrl);
          setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
        }
      }

      onImagesUploaded(uploadedUrls);
      toast.success(`${uploadedUrls.length} תמונות הועלו בהצלחה!`);
      setUploadProgress({});

    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('שגיאה בהעלאת התמונות');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      uploadImages(files);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      uploadImages(files);
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
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

        {uploading ? (
          <div className="flex flex-col items-center">
            <Loader className="w-8 h-8 text-sage-600 animate-spin mb-2" />
            <p className="text-sage-600 font-hebrew">מעלה תמונות...</p>
            
            <div className="mt-4 w-full max-w-sm space-y-2">
              {Object.entries(uploadProgress).map(([fileName, progress]) => (
                <div key={fileName} className="text-xs">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600 font-hebrew-light truncate">{fileName}</span>
                    <span className="text-sage-600">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div 
                      className="bg-sage-600 h-1 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <ImageIcon className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-600 font-hebrew mb-2">
              גרור תמונות לכאן או לחץ להעלאה
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-sage-600 hover:bg-sage-700 text-white px-4 py-2 rounded-lg font-hebrew font-medium transition-colors flex items-center space-x-2 rtl:space-x-reverse"
            >
              <Plus className="w-4 h-4" />
              <span>{buttonText}</span>
            </button>
            <p className="text-xs text-gray-500 mt-2 font-hebrew-light">
              JPG, PNG, GIF, WebP - מקסימום {maxImages} תמונות
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultipleImageUploader;