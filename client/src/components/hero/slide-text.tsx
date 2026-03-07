import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface SlideTextProps {
  children: ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
  delay?: number;
}

// Fade in with upward motion animation
export function SlideText({ 
  children, 
  className = "", 
  align = "left",
  delay = 0 
}: SlideTextProps) {
  const alignments = {
    left: "items-start text-left",
    center: "items-center text-center",
    right: "items-end text-right",
  };

  return (
    <motion.div
      className={`flex flex-col ${alignments[align]} ${className}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{
        duration: 0.8,
        delay: delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  );
}

// Masked reveal animation for text
interface MaskedTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export function MaskedText({ text, className = "", delay = 0 }: MaskedTextProps) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: "0%" }}
        transition={{
          duration: 0.8,
          delay: delay,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        {text}
      </motion.div>
    </div>
  );
}

// Underline reveal animation
interface UnderlineRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function UnderlineReveal({ children, className = "", delay = 0 }: UnderlineRevealProps) {
  return (
    <div className={`relative inline-block ${className}`}>
      <motion.div
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{
          duration: 0.6,
          delay: delay + 0.3,
          ease: "easeOut",
        }}
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary to-accent"
      />
      {children}
    </div>
  );
}

// Slide 1 Content
interface Slide1ContentProps {
  visible: boolean;
}

export function Slide1Content({ visible }: Slide1ContentProps) {
  return (
    <AnimatePresence>
      {visible && (
        <div className="max-w-xl">
          <SlideText align="left" delay={0.2}>
            <h1 className="text-5xl lg:text-7xl font-display font-bold text-white mb-6 leading-[1.1]">
              Nourish your body, <br />
              <span className="text-primary italic font-serif font-light">delight your soul.</span>
            </h1>
          </SlideText>
          
          <SlideText align="left" delay={0.5}>
            <p className="text-lg text-white/70 mb-10 max-w-lg leading-relaxed">
              True taste of home wherever you roam.
            </p>
          </SlideText>
        </div>
      )}
    </AnimatePresence>
  );
}

// Slide 2 Content - Text appears from under the bottle
interface Slide2ContentProps {
  visible: boolean;
}

export function Slide2Content({ visible }: Slide2ContentProps) {
  return (
    <AnimatePresence>
      {visible && (
        <div className="max-w-xl">
          <SlideText align="center" delay={0.8}>
            <MaskedText 
              text="Authentic homemade mango pickle." 
              className="text-4xl lg:text-6xl font-display font-bold text-white leading-[1.2]"
              delay={0.5}
            />
          </SlideText>
          
          <SlideText align="center" delay={1.2}>
            <p className="text-lg text-white/60 mt-6 max-w-lg mx-auto">
              Made with love, using traditional recipes passed down through generations.
            </p>
          </SlideText>
        </div>
      )}
    </AnimatePresence>
  );
}

// Slide 3 Content (placeholder)
interface Slide3ContentProps {
  visible: boolean;
}

export function Slide3Content({ visible }: Slide3ContentProps) {
  return (
    <AnimatePresence>
      {visible && (
        <div className="max-w-xl">
          <SlideText align="center" delay={0.3}>
            <h2 className="text-4xl lg:text-6xl font-display font-bold text-white mb-6 leading-[1.2]">
              Premium Quality <br />
              <span className="text-primary">Ingredients</span>
            </h2>
          </SlideText>
          
          <SlideText align="center" delay={0.5}>
            <p className="text-lg text-white/60 max-w-lg mx-auto">
              Sourced from the finest farms, ensuring every bite is pure perfection.
            </p>
          </SlideText>
        </div>
      )}
    </AnimatePresence>
  );
}

// Slide 4 Content (placeholder)
interface Slide4ContentProps {
  visible: boolean;
}

export function Slide4Content({ visible }: Slide4ContentProps) {
  return (
    <AnimatePresence>
      {visible && (
        <div className="max-w-xl">
          <SlideText align="center" delay={0.3}>
            <h2 className="text-4xl lg:text-6xl font-display font-bold text-white mb-6 leading-[1.2]">
              Taste the <span className="text-accent">Tradition</span>
            </h2>
          </SlideText>
          
          <SlideText align="center" delay={0.5}>
            <p className="text-lg text-white/60 max-w-lg mx-auto">
              Order now and experience the authentic flavors of India.
            </p>
          </SlideText>
        </div>
      )}
    </AnimatePresence>
  );
}

