 import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

// Auto-slide interval in milliseconds (5 seconds)
const AUTO_SLIDE_INTERVAL = 5000;

export function HeroSlider({ className = "" }: HeroSliderProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle navigation
  const goToSlide = useCallback((slideIndex: number) => {
    if (slideIndex !== activeSlide && !isAnimating) {
      setIsAnimating(true);
      setActiveSlide(slideIndex);
      setTimeout(() => setIsAnimating(false), 600);
    }
  }, [activeSlide, isAnimating]);

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        setActiveSlide((prev) => (prev + 1) % HERO_BACKGROUNDS.length);
      }
    }, AUTO_SLIDE_INTERVAL);

    return () => clearInterval(interval);
  }, [isAnimating]);

  return (
    <section 
      className={`relative h-[40vh] md:h-[70vh] w-full overflow-hidden ${className}`}
    >
      {/* Full Background Image */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeSlide}
            src={HERO_BACKGROUNDS[activeSlide]}
            alt="Babita's Kitchen"
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          />
        </AnimatePresence>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-8">
        
        {/* Text Content - Centered */}
        <div className="max-w-2xl text-center">
          <AnimatePresence mode="wait">
            
            {/* Slide 1 Text */}
            {activeSlide === 0 && (
              <motion.div
                key="slide1"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
                className="text-center"
              >
                <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                  Nourish your body,{' '}
                  <span className="text-amber-300 italic">delight your soul.</span>
                </h1>
                <p className="text-lg text-white/90 drop-shadow">
                  True taste of home wherever you roam.
                </p>
              </motion.div>
            )}

            {/* Slide 2 Text */}
            {activeSlide === 1 && (
              <motion.div
                key="slide2"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
                className="text-center"
              >
                <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                  Authentic homemade{' '}
                  <span className="text-amber-300">mango pickle.</span>
                </h2>
                <p className="text-lg text-white/80 drop-shadow max-w-md mx-auto">
                  Made with love, using traditional recipes passed down through generations.
                </p>
              </motion.div>
            )}

            {/* Slide 3 Text */}
            {activeSlide === 2 && (
              <motion.div
                key="slide3"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
                className="text-center"
              >
                <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                  Premium Quality{' '}
                  <span className="text-amber-300">Ingredients</span>
                </h2>
                <p className="text-lg text-white/80 drop-shadow">
                  Sourced from the finest farms.
                </p>
              </motion.div>
            )}

            {/* Slide 4 Text */}
            {activeSlide === 3 && (
              <motion.div
                key="slide4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
                className="text-center"
              >
                <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                  Taste the <span className="text-red-400">Tradition</span>
                </h2>
                <p className="text-lg text-white/80 drop-shadow">
                  Order now and experience authentic flavors.
                </p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4">
          {/* Dot Indicators */}
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
                disabled={isAnimating}
              />
            ))}
          </div>
        </div>

        {/* Arrow Navigation */}
        <div className="absolute bottom-8 right-8 z-30 flex items-center gap-2">
          <button
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-300"
            onClick={() => activeSlide > 0 && goToSlide(activeSlide - 1)}
            disabled={activeSlide === 0 || isAnimating}
          >
            <ChevronLeft className={`w-5 h-5 text-white ${activeSlide === 0 ? 'opacity-30' : ''}`} />
          </button>
          <button
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-300"
            onClick={() => activeSlide < 3 && goToSlide(activeSlide + 1)}
            disabled={activeSlide === 3 || isAnimating}
          >
            <ChevronRight className={`w-5 h-5 text-white ${activeSlide === 3 ? 'opacity-30' : ''}`} />
          </button>
        </div>
      </div>
    </section>
  );
}

