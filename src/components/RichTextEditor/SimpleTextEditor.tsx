import React from 'react';

interface SimpleTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const SimpleTextEditor: React.FC<SimpleTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'הכנס תיאור...',
  className = ''
}) => {
  return (
    <div className={`simple-text-editor ${className}`}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={6}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-sage-500 text-right font-hebrew transition-all resize-vertical"
        style={{
          direction: 'rtl',
          textAlign: 'right',
          fontFamily: 'Heebo, system-ui, sans-serif'
        }}
      />
      <div className="mt-2 text-sm text-gray-500 font-hebrew-light text-right">
        תוכל להשתמש בפסקאות חדשות ובטקסט רגיל
      </div>
    </div>
  );
};

export default SimpleTextEditor;