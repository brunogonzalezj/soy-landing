import { useEffect, useState } from 'react';

const LANGUAGES = [
  { code: 'en', name: 'English', region: 'United States', flag: '🇺🇸' },
  { code: 'es', name: 'Español', region: 'España', flag: '🇪🇸' },
  { code: 'pt', name: 'Português', region: 'Brasil', flag: '🇧🇷' },
  { code: 'zh', name: '中文', region: '中国', flag: '🇨🇳' },
  { code: 'ar', name: 'العربية', region: 'العربية', flag: '🇸🇦' },
];

export default function LanguageModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem('preferredLanguage');
    if (!savedLang) {
      setIsOpen(true);
    }
  }, []);

  const handleLanguageSelect = (langCode) => {
    localStorage.setItem('preferredLanguage', langCode);
    window.dispatchEvent(new CustomEvent('languageChange', { detail: { lang: langCode } }));
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-forest/85 backdrop-blur-sm p-4">
      <div className="bg-white rounded-sm border border-line shadow-2xl max-w-md w-full p-8 sm:p-10">
        <div className="flex justify-center mb-6">
          <img
            src="/images/Logo SOY.svg"
            alt="Soy Excellence Center"
            className="h-12 w-auto"
          />
        </div>

        <div className="eyebrow justify-center mb-3">
          <span className="eyebrow-rule" />
          Welcome
        </div>
        <h2 className="text-2xl sm:text-3xl text-center text-ink mb-2 leading-tight">
          Choose your language
        </h2>
        <p className="text-center text-ink/55 text-sm mb-8">
          Select the language you'd like to browse the site in.
        </p>

        <div className="space-y-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              className="w-full flex items-center gap-4 p-3.5 border border-line rounded-sm hover:border-sec-yellow hover:bg-sec-yellow/10 transition-colors duration-200"
            >
              <span className="text-2xl leading-none">{lang.flag}</span>
              <div className="text-left">
                <div className="font-semibold text-sm text-ink">{lang.name}</div>
                <div className="text-xs text-ink/45">{lang.region}</div>
              </div>
            </button>
          ))}
        </div>

        <p className="text-center text-xs text-ink/40 mt-6">
          You can change this anytime from the menu.
        </p>
      </div>
    </div>
  );
}
