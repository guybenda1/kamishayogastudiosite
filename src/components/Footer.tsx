import React from 'react';
import { Facebook, Instagram, MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-sage-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description - Centered */}
          <div className="text-center">
            <div className="mb-4">
              <img 
                src="https://eyotdvabnyowlmdqctsg.supabase.co/storage/v1/object/sign/store/IMG_5702-removebg-preview-optimized.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iZjg3OTU2OC05MWUyLTQxYzYtYmU3MC0wMDZiOTcyZmExY2UiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJzdG9yZS9JTUdfNTcwMi1yZW1vdmViZy1wcmV2aWV3LW9wdGltaXplZC53ZWJwIiwiaWF0IjoxNzU1NTkyNDE0LCJleHAiOjE3ODcxMjg0MTR9.ukgPpGSN7VVFXDal5_qNeK1cw5ohp5Fq_0rmoDxiKXc" 
                alt="Kamisha Boutique Yoga Studio" 
                className="h-24 sm:h-32 w-auto mx-auto object-contain"
              />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold font-hebrew text-white">Kamisha</h3>
              <p className="text-lg font-hebrew text-white">Boutique Yoga Studio</p>
            </div>

            {/* Social Media Links - Centered */}
            <div className="mt-6">
              <div className="flex justify-center space-x-4 rtl:space-x-reverse">
                <a
                  href="https://www.facebook.com/limor.ben.david.2025"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-blue-400 transition-colors duration-300 transform hover:scale-110"
                  aria-label="Facebook"
                >
                  <Facebook className="w-6 h-6" />
                </a>
                <a
                  href="https://www.instagram.com/limorbendavid_yoga/?igsh=c2drYmptcjJpdGht&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-pink-400 transition-colors duration-300 transform hover:scale-110"
                  aria-label="Instagram"
                >
                  <Instagram className="w-6 h-6" />
                </a>
               
                <a
                  href="https://wa.me/972505172253"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-green-400 transition-colors duration-300 transform hover:scale-110"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-right">
            <h4 className="text-lg font-bold mb-4 font-hebrew text-white">קישורים מהירים</h4>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-white hover:text-sage-100 transition-colors font-hebrew-light">
                  בית
                </a>
              </li>
              <li>
                <a href="#about" className="text-white hover:text-sage-100 transition-colors font-hebrew-light">
                  אודותיי
                </a>
              </li>
              <li>
                <a href="#studio" className="text-white hover:text-sage-100 transition-colors font-hebrew-light">
                  הסטודיו
                </a>
              </li>
              <li>
                <a href="#gallery" className="text-white hover:text-sage-100 transition-colors font-hebrew-light">
                  גלריה
                </a>
              </li>
              <li>
                <a href="https://kamishayoga.web.arboxapp.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-sage-100 transition-colors font-hebrew-light">
                  רישום לתרגולים
                </a>
              </li>
              <li>
                <a href="#retreats" className="text-white hover:text-sage-100 transition-colors font-hebrew-light">
                  ריטריטים
                </a>
              </li>       
              <li>
                <a href="#contact" className="text-white hover:text-sage-100 transition-colors font-hebrew-light">
                  צור קשר
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="text-right">
            <h4 className="text-lg font-bold mb-4 font-hebrew text-white">פרטי התקשרות</h4>
            <div className="space-y-2 text-white font-hebrew-light">
              <p>טלפון: 050-5172253</p>
              <p>אימייל: <a href="mailto:marketing@kamishjewelry.com" className="hover:text-sage-100 transition-colors">marketing@kamishjewelry.com</a></p>
              <p>הסטודיו: הרותם 20, מעלה אדומים</p>
              <a 
                href="https://ul.waze.com/ul?place=EhlIYXJvdGVtIDIwLCBNYSdhbGUgQWR1bWltIjASLgoUChIJFQCHSjUpAxURXpg_qcKtlaoQFCoUChIJ2xCvRzUpAxURjnsD0fbre0Y&ll=31.76580320%2C35.30286170&navigate=yes&utm_campaign=default&utm_source=waze_website&utm_medium=lm_share_location"
                target="_blank"
                rel="noopener noreferrer"
                className="text-warm-200 hover:text-white transition-colors underline block mt-2"
              >
                הוראות הגעה ב-Waze
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-sage-800 mt-8 pt-8 text-center">
          <p className="text-white font-hebrew-light">
            © {new Date().getFullYear()} Kamisha Boutique Yoga Studio
          </p>
          <p className="text-white font-hebrew-light">
          כל הזכויות שמורות.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;