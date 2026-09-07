import { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, ArrowUpRight } from 'lucide-react';

const SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&h=1400&fit=crop',
    titleKey: 'hero.slide1.title',
    subtitleKey: 'hero.slide1.subtitle',
    ctaKey: 'hero.slide1.cta',
    link: '#about',
  },
  {
    image: 'https://images.unsplash.com/photo-1574943320219-55ed5d8f6424?w=1600&h=1400&fit=crop',
    titleKey: 'hero.slide2.title',
    subtitleKey: 'hero.slide2.subtitle',
    ctaKey: 'hero.slide2.cta',
    link: '#mission',
  },
  {
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1600&h=1400&fit=crop',
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
    }, 6000);

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

  const slide = SLIDES[currentSlide];

  return (
    <section
      className="relative bg-forest overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Faint dot-grid texture — brand-tied, not a generic mesh blob */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
          backgroundSize: '22px 22px',
          color: '#F3B537',
        }}
      />

      <div className="relative container mx-auto px-4 pt-14 pb-0 lg:pt-0">
        <div className="grid lg:grid-cols-[1.1fr_1fr] items-center gap-10 lg:gap-0 min-h-0 lg:min-h-[620px]">
          {/* Text column */}
          <div className="relative lg:pr-16 py-4 lg:py-20">
            <div className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-sec-yellow mb-6">
              <span className="block w-8 h-[3px] bg-sec-yellow" />
              A USSOY Program
            </div>

            <div className="relative min-h-[210px] sm:min-h-[240px] lg:min-h-[260px]">
              {SLIDES.map((s, index) => (
                <div
                  key={index}
                  className={`transition-all duration-700 ${
                    index === currentSlide
                      ? 'opacity-100 translate-y-0 relative'
                      : 'opacity-0 translate-y-3 absolute inset-0 pointer-events-none'
                  }`}
                >
                  <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] text-white leading-[1.05] mb-5 max-w-xl">
                    {translations[s.titleKey] || s.titleKey}
                  </h1>
                  <p className="text-lg text-white/65 max-w-lg leading-relaxed">
                    {translations[s.subtitleKey] || s.subtitleKey}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-8">
              <a href={slide.link} className="btn-primary">
                {translations[slide.ctaKey] || slide.ctaKey}
                <ArrowRight size={16} />
              </a>
              <a href="/contact" className="btn-outline-light">
                Get in touch
              </a>
            </div>

            {/* Slide index + controls */}
            <div className="flex items-center gap-6 mt-14 pb-8 lg:pb-0">
              <div className="flex items-center gap-1">
                <button
                  onClick={goToPrevious}
                  className="w-9 h-9 flex items-center justify-center border border-white/20 text-white/70 hover:border-sec-yellow hover:text-sec-yellow transition-colors duration-300"
                  aria-label="Previous slide"
                >
                  <ArrowLeft size={16} />
                </button>
                <button
                  onClick={goToNext}
                  className="w-9 h-9 flex items-center justify-center border border-white/20 text-white/70 hover:border-sec-yellow hover:text-sec-yellow transition-colors duration-300"
                  aria-label="Next slide"
                >
                  <ArrowRight size={16} />
                </button>
              </div>

              <div className="flex items-center gap-4 font-display font-bold text-sm">
                {SLIDES.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`pb-1 border-b-2 transition-colors duration-300 ${
                      index === currentSlide
                        ? 'text-sec-yellow border-sec-yellow'
                        : 'text-white/40 border-transparent hover:text-white/70'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  >
                    0{index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Image column */}
          <div className="relative h-[280px] sm:h-[360px] lg:h-[620px]">
            <div
              className="absolute inset-0 lg:inset-y-0 lg:right-0 lg:left-10 border-l-4 border-sec-yellow"
              style={{ clipPath: 'polygon(4% 0, 100% 0, 100% 100%, 0% 100%)' }}
            >
              {SLIDES.map((s, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ backgroundImage: `url(${s.image})` }}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-forest/40 via-transparent to-transparent" />
            </div>

            <a
              href="/what-we-do"
              className="hidden lg:flex absolute bottom-8 right-0 items-center gap-2 bg-white text-ink px-5 py-3 text-xs font-bold uppercase tracking-wide hover:bg-sec-yellow transition-colors duration-300"
            >
              Explore our work
              <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
