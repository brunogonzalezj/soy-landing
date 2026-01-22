import { translations } from './translations.js';

export function getTranslation(lang, key) {
  const keys = key.split('.');
  let value = translations[lang];

  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = value[k];
    } else {
      value = key;
      break;
    }
  }

  return value || key;
}

export function t(key) {
  const lang = typeof window !== 'undefined' ? localStorage.getItem('preferredLanguage') || 'en' : 'en';
  return getTranslation(lang, key);
}

// Initialize translations on page load
if (typeof window !== 'undefined') {
  window.currentLang = localStorage.getItem('preferredLanguage') || 'en';

  // Listen for language changes
  window.addEventListener('languageChange', (e) => {
    window.currentLang = e.detail.lang;
    // Force page reload to update all translations
    setTimeout(() => {
      window.location.reload();
    }, 100);
  });
}
