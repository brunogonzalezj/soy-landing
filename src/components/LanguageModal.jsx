import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const LANGUAGES = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ar', name: 'Arabian', flag: '🇸🇦' },
];

export default function LanguageModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  useEffect(() => {
    const savedLang = localStorage.getItem('preferred-language');
    if (!savedLang) {
      setIsOpen(true);
    } else {
      setSelectedLanguage(savedLang);
    }
  }, []);

  const handleLanguageSelect = (langCode) => {
    localStorage.setItem('preferred-language', langCode);
    setSelectedLanguage(langCode);
    setIsOpen(false);

    // You can add logic here to change the actual page language
    // For example, using Astro's i18n or redirecting to /es, /en, /ar
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-fade-in">
        {/* Close Button (optional, as per requirements modal should be blocking) */}
        {/* <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <X size={24} />
        </button> */}

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="/images/Logo SOY.svg"
            alt="Soy Excellence Center"
            className="h-16 w-auto"
          />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-ussec-green mb-2">
          Welcome / Bienvenido
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Please select your preferred language / Por favor seleccione su idioma preferido
        </p>

        {/* Language Options */}
        <div className="space-y-3">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-sec-yellow hover:bg-sec-yellow/5 transition-all duration-200 group"
            >
              <span className="text-4xl">{lang.flag}</span>
              <span className="text-lg font-semibold text-gray-800 group-hover:text-sec-yellow transition-colors">
                {lang.name}
              </span>
            </button>
          ))}
        </div>

        {/* Helper Text */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Your selection will be saved for future visits
        </p>
      </div>
    </div>
  );
}
