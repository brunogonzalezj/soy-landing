import { useState, useEffect, useRef } from 'react';
import { Quote, ArrowLeft, ArrowRight, Globe, Building2, BookOpen, Users } from 'lucide-react';
import translationsData from '../i18n/translations.json';

function getInitialTranslations() {
  if (typeof window === 'undefined') return translationsData.en;
  const lang = localStorage.getItem('preferredLanguage') || 'en';
  return translationsData[lang] || translationsData.en;
}

const STATISTICS = [
  {
    value: 30,
    labelKey: 'statistics.countriesReached',
    descriptionKey: 'statistics.countriesReachedDesc',
    icon: Globe,
    suffix: '+',
  },
  {
    value: 250,
    labelKey: 'statistics.companiesReached',
    descriptionKey: 'statistics.companiesReachedDesc',
    icon: Building2,
    suffix: '+',
  },
  {
    value: 500,
    labelKey: 'statistics.coursesExecuted',
    descriptionKey: 'statistics.coursesExecutedDesc',
    icon: BookOpen,
    suffix: '+',
  },
  {
    value: 15000,
    labelKey: 'statistics.traineesReached',
    descriptionKey: 'statistics.traineesReachedDesc',
    icon: Users,
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
      {count.toLocaleString('en-US')}{suffix}
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
  const [translations, setTranslations] = useState(getInitialTranslations);

  useEffect(() => {
    const handleLanguageChange = () => setTranslations(getInitialTranslations());
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

  const active = TESTIMONIALS_KEYS[currentTestimonial];

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4">
        {/* Statistics Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-line mb-24 md:mb-28">
          {STATISTICS.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <ScrollReveal key={index} delay={index * 120}>
                <div className="border-l border-line last:border-r px-6 py-8 h-full">
                  <Icon size={22} className="text-sec-yellow mb-6" />
                  <div className="font-display font-bold text-5xl md:text-6xl text-ink mb-2 leading-none">
                    <CountUp end={stat.value} suffix={stat.suffix} duration={2000} />
                  </div>
                  <div className="text-sm font-bold text-ink mb-1">
                    {translations[stat.labelKey] || stat.labelKey}
                  </div>
                  <div className="text-sm text-ink/50">{translations[stat.descriptionKey] || stat.descriptionKey}</div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Testimonials Section */}
        <ScrollReveal delay={200}>
          <div className="max-w-5xl mx-auto">
            <div className="mb-10">
              <span className="eyebrow mb-4">
                <span className="eyebrow-rule" />
                What members say
              </span>
              <h2 className="text-3xl md:text-4xl text-ink">
                {translations['statistics.whatMembersSay'] || 'Hear from industry leaders'}
              </h2>
            </div>

            {/* Testimonial */}
            <div className="border-t border-line pt-10 grid md:grid-cols-[auto_1fr] gap-8 md:gap-14 items-start">
              <Quote size={56} strokeWidth={1.5} className="text-sec-yellow flex-shrink-0" />

              <div>
                {active && (
                  <>
                    <p className="text-xl md:text-2xl text-ink leading-relaxed mb-8 min-h-[6rem] md:min-h-[4.5rem]">
                      {translations[active.quoteKey] || active.quoteKey}
                    </p>

                    <div className="flex items-center justify-between flex-wrap gap-6">
                      <div className="flex items-center gap-4">
                        <div className="avatar-tile w-14 h-14 text-lg">
                          {active.avatar}
                        </div>
                        <div>
                          <div className="font-bold text-ink">
                            {translations[active.authorKey] || 'Author'}
                          </div>
                          <div className="text-sm text-ink/50">
                            {translations[active.roleKey] || 'Role'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-4 font-display font-bold text-sm">
                          {TESTIMONIALS_KEYS.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentTestimonial(index)}
                              className={`pb-1 border-b-2 transition-colors duration-300 ${
                                index === currentTestimonial
                                  ? 'text-ussec-green border-sec-yellow'
                                  : 'text-ink/30 border-transparent hover:text-ink/60'
                              }`}
                              aria-label={`Go to testimonial ${index + 1}`}
                            >
                              0{index + 1}
                            </button>
                          ))}
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={goToPrevious}
                            className="w-9 h-9 flex items-center justify-center border border-line hover:border-ussec-green hover:text-ussec-green transition-colors duration-300"
                            aria-label="Previous testimonial"
                          >
                            <ArrowLeft size={15} />
                          </button>
                          <button
                            onClick={goToNext}
                            className="w-9 h-9 flex items-center justify-center border border-line hover:border-ussec-green hover:text-ussec-green transition-colors duration-300"
                            aria-label="Next testimonial"
                          >
                            <ArrowRight size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
