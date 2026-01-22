import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&h=1080&fit=crop',
    titleKey: 'hero.slide1.title',
    subtitleKey: 'hero.slide1.subtitle',
    ctaKey: 'hero.slide1.cta',
    link: '#about',
  },
  {
    image: 'https://images.unsplash.com/photo-1574943320219-55ed5d8f6424?w=1920&h=1080&fit=crop',
    titleKey: 'hero.slide2.title',
    subtitleKey: 'hero.slide2.subtitle',
    ctaKey: 'hero.slide2.cta',
    link: '#mission',
  },
  {
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&h=1080&fit=crop',
    titleKey: 'hero.slide3.title',
    subtitleKey: 'hero.slide3.subtitle',
    ctaKey: 'hero.slide3.cta',
    link: '#hubs',
  },
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [translations, setTranslations] = useState({});

  // Load translations
  useEffect(() => {
    const loadTranslations = async () => {
      const lang = localStorage.getItem('preferredLanguage') || 'en';
      try {
        const response = await fetch('/i18n/translations.json');
        const data = await response.json();
        setTranslations(data[lang] || {});
      } catch (error) {
        console.error('Failed to load translations:', error);
      }
    };

    loadTranslations();

    // Reload on language change
    const handleLanguageChange = () => {
      loadTranslations();
    };

    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    setIsAutoPlaying(false);
  };

  return (
    <section className="relative h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden">
      {/* Slides */}
      <div className="relative h-full">
        {SLIDES.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Background Image with Overlay */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ussec-green/90 via-ussec-green/60 to-transparent" />

            {/* Content */}
            <div className="relative h-full container mx-auto px-4 flex items-center">
              <div className="max-w-2xl text-white">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  {translations[slide.titleKey] || slide.titleKey}
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-gray-100">
                  {translations[slide.subtitleKey] || slide.subtitleKey}
                </p>
                <a
                  href={slide.link}
                  className="inline-block bg-sec-yellow hover:bg-ussec-yellow text-white font-semibold px-8 py-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  {translations[slide.ctaKey] || slide.ctaKey}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-200 hover:scale-110"
        aria-label="Previous slide"
      >
        <ChevronLeft size={32} />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-200 hover:scale-110"
        aria-label="Next slide"
      >
        <ChevronRight size={32} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-3 rounded-full transition-all duration-200 ${
              index === currentSlide
                ? 'bg-sec-yellow w-12'
                : 'bg-white/50 hover:bg-white/70 w-3'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Resume Auto-play on mouse leave */}
      <div
        className="absolute inset-0"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      />
    </section>
  );
}
