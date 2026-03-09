 import { useState, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface HeroSliderProps {
  className?: string;
}

// Array of hero backgrounds for each slide
const HERO_BACKGROUNDS = [
  "/papad and pickle.2.jpeg",
  "/papad and pickle.1.jpeg",
  "/papad and pickle.3.jpeg",
  "/papad and pickle.jpeg"
];

// Auto-slide interval in milliseconds
const AUTO_SLIDE_INTERVAL = 5000;

// Slide content data
const SLIDE_CONTENT = [
  {
    title: "Nourish your body, ",
    subtitle: "delight your soul.",
    isItalic: true,
    text: "True taste of home wherever you roam."
  },
  {
    title: "Authentic homemade ",
    subtitle: "mango pickle.",
    isItalic: false,
    text: "Made with love, using traditional recipes passed down through generations."
  },
  {
    title: "Premium Quality ",
    subtitle: "Ingredients",
    isItalic: false,
    text: "Sourced from the finest farms."
  },
  {
    title: "Taste the ",
    subtitle: "Tradition",
    isItalic: false,
    text: "Order now and experience authentic flavors."
  }
];

export function HeroSlider({ className = "" }: HeroSliderProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Animation variants for text moving from bottom to top
  const textVariants = {
    hidden: { 
      opacity: 0, 
      y: 50, 
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.2
      }
    },
    exit: { 
      opacity: 0, 
      y: -50, 
      scale: 0.95,
      transition: {
        duration: 0.6,
        ease: "easeIn"
      }
    }
  };

  const imageVariants = {
    hidden: { 
      opacity: 0, 
      scale: 1.1 
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 1.2,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9,
      transition: {
        duration: 0.8,
        ease: "easeIn"
      }
    }
  };

  // Handle navigation
  const goToSlide = useCallback((slideIndex: number) => {
    if (slideIndex !== activeSlide) {
      setIsAnimating(true);
      setTimeout(() => {
        setActiveSlide(slideIndex);
        setIsAnimating(false);
      }, 100);
    }
  }, [activeSlide]);

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_BACKGROUNDS.length);
    }, AUTO_SLIDE_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  const content = SLIDE_CONTENT[activeSlide];

  return (
    <section 
      className={`relative h-[40vh] md:h-[70vh] w-full overflow-hidden ${className}`}
      id="specials"
    >
      {/* Full Background - Animated transitions */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeSlide}
            src={HERO_BACKGROUNDS[activeSlide]}
            alt="Babita's Kitchen"
            className="absolute inset-0 w-full h-full object-cover"
            variants={imageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          />
        </AnimatePresence>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-8">
        {/* Text Content - Centered with animations */}
        <div className="max-w-2xl text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide}
              className="text-center"
              variants={textVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {activeSlide === 0 ? (
                <motion.h1 
                  className="text-4xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg"
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  {content.title}
                  <motion.span 
                    className={`text-amber-300 ${content.isItalic ? 'italic' : ''}`}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    {content.subtitle}
                  </motion.span>
                </motion.h1>
              ) : (
                <motion.h2 
                  className="text-3xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg"
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  {content.title}
                  <motion.span 
                    className={activeSlide === 3 ? "text-red-400" : "text-amber-300"}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    {content.subtitle}
                  </motion.span>
                </motion.h2>
              )}
              <motion.p 
                className="text-lg text-white/90 drop-shadow"
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                {content.text}
              </motion.p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4">
          <div className="flex items-center gap-2">
            {[0, 1, 2, 3].map((index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`relative h-2 rounded-full transition-all duration-300 ${
                  activeSlide === index 
                    ? "w-8 bg-amber-400" 
                    : "w-2 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Arrow Navigation */}
        <div className="absolute bottom-8 right-8 z-30 flex items-center gap-2">
          <button
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-300"
            onClick={() => activeSlide > 0 ? goToSlide(activeSlide - 1) : goToSlide(3)}
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-300"
            onClick={() => activeSlide < 3 ? goToSlide(activeSlide + 1) : goToSlide(0)}
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </section>
  );
}

