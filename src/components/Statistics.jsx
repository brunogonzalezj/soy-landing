import { useState, useEffect, useRef } from 'react';
import { Quote, ChevronLeft, ChevronRight, Users, Globe, Award, BookOpen } from 'lucide-react';

const STATISTICS = [
  {
    value: 500,
    labelKey: 'statistics.expertMembers',
    descriptionKey: 'statistics.globalNetwork',
    icon: Users,
    suffix: '+',
  },
  {
    value: 50,
    labelKey: 'statistics.countriesReached',
    descriptionKey: 'statistics.internationalPresence',
    icon: Globe,
    suffix: '+',
  },
  {
    value: 100,
    labelKey: 'statistics.researchProjects',
    descriptionKey: 'statistics.innovationInitiatives',
    icon: BookOpen,
    suffix: '+',
  },
  {
    value: 25,
    labelKey: 'statistics.yearsOfExcellence',
    descriptionKey: 'statistics.leadingIndustry',
    icon: Award,
    suffix: '+',
  },
];

// Custom hook for intersection observer
const useInView = (threshold = 0.1) => {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold]);

  return [ref, isInView];
};

// Count up animation component
const CountUp = ({ end, suffix = '', duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const [ref, isInView] = useInView(0.5);

  useEffect(() => {
    if (!isInView) return;

    let startTime;
    let animationFrame;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(end * easeOutQuart));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isInView, end, duration]);

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
};

// Scroll reveal wrapper component
const ScrollReveal = ({ children, delay = 0, className = '' }) => {
  const [ref, isInView] = useInView(0.1);

  return (
    <div
      ref={ref}
      className={`scroll-reveal ${isInView ? 'is-visible' : ''} ${className}`}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.8s ease-out ${delay}ms, transform 0.8s ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

const TESTIMONIALS_KEYS = [
  {
    quoteKey: 'testimonials.testimonial1.quote',
    authorKey: 'testimonials.testimonial1.author',
    roleKey: 'testimonials.testimonial1.role',
    avatar: 'MR',
  },
  {
    quoteKey: 'testimonials.testimonial2.quote',
    authorKey: 'testimonials.testimonial2.author',
    roleKey: 'testimonials.testimonial2.role',
    avatar: 'JC',
  },
  {
    quoteKey: 'testimonials.testimonial3.quote',
    authorKey: 'testimonials.testimonial3.author',
    roleKey: 'testimonials.testimonial3.role',
    avatar: 'AH',
  },
];

export default function Statistics() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [translations, setTranslations] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Load translations
  useEffect(() => {
    const loadTranslations = async () => {
      const lang = localStorage.getItem('preferredLanguage') || 'en';
      try {
        const response = await fetch('/i18n/translations.json');
        const data = await response.json();
        setTranslations(data[lang] || {});
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load translations:', error);
        setIsLoading(false);
      }
    };

    loadTranslations();

    // Reload on language change
    const handleLanguageChange = () => {
      setIsLoading(true);
      loadTranslations();
    };

    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS_KEYS.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const goToPrevious = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + TESTIMONIALS_KEYS.length) % TESTIMONIALS_KEYS.length
    );
  };

  const goToNext = () => {
    setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS_KEYS.length);
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {STATISTICS.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <ScrollReveal key={index} delay={index * 150}>
                <div className="text-center p-6 rounded-xl hover:bg-sec-yellow/5 transition-all duration-300 group">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sec-yellow/10 text-sec-yellow mb-4 group-hover:bg-sec-yellow group-hover:text-white transition-all duration-300">
                    <Icon size={32} />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-ussec-green mb-2">
                    <CountUp end={stat.value} suffix={stat.suffix} duration={2000} />
                  </div>
                  <div className="text-lg font-semibold text-gray-900 mb-1">
                    {translations[stat.labelKey] || stat.labelKey}
                  </div>
                  <div className="text-sm text-gray-600">{translations[stat.descriptionKey] || stat.descriptionKey}</div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Testimonials Section */}
        <ScrollReveal delay={600}>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-ussec-green mb-4">
                {translations['statistics.whatMembersSay'] || 'What Our Members Say'}
              </h2>
              <p className="text-gray-600">
                {translations['statistics.hearFromLeaders'] || 'Hear from industry leaders around the world'}
              </p>
            </div>

            {/* Testimonial Carousel */}
            <div className="relative">
              <div className="bg-gray-50 rounded-2xl p-8 md:p-12 text-center transition-all duration-500 hover:shadow-xl">
                <Quote
                  size={48}
                  className="text-sec-yellow/30 mx-auto mb-6"
                />

                {!isLoading && TESTIMONIALS_KEYS[currentTestimonial] && (
                  <>
                    <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8">
                      "{translations[TESTIMONIALS_KEYS[currentTestimonial].quoteKey] || TESTIMONIALS_KEYS[currentTestimonial].quoteKey}"
                    </p>

                    <div className="flex items-center justify-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-ussec-green text-white flex items-center justify-center text-xl font-bold">
                        {TESTIMONIALS_KEYS[currentTestimonial].avatar}
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-gray-900">
                          {translations[TESTIMONIALS_KEYS[currentTestimonial].authorKey] || 'Author'}
                        </div>
                        <div className="text-sm text-gray-600">
                          {translations[TESTIMONIALS_KEYS[currentTestimonial].roleKey] || 'Role'}
                        </div>
                      </div>
                    </div>
                  </>
                )}
                
                {isLoading && (
                  <div className="text-gray-500">Loading testimonials...</div>
                )}
              </div>

              {/* Navigation Buttons */}
              <button
                onClick={goToPrevious}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 bg-white hover:bg-sec-yellow text-gray-700 hover:text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 bg-white hover:bg-sec-yellow text-gray-700 hover:text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
                aria-label="Next testimonial"
              >
                <ChevronRight size={24} />
              </button>

              {/* Indicators */}
              <div className="flex justify-center gap-2 mt-8">
                {TESTIMONIALS_KEYS.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentTestimonial
                        ? 'bg-sec-yellow w-8'
                        : 'bg-gray-300 hover:bg-gray-400 w-2'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
