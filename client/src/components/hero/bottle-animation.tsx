import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { motion } from "framer-motion";

interface BottleAnimationProps {
  isRolling?: boolean;
  rollProgress?: number; // 0 to 1 for rolling animation
  isUpright?: boolean;
  isFloating?: boolean;
  className?: string;
}

// Using the actual pickle bottle image
const BOTTLE_IMAGE_HORIZONTAL = "/papad and pickle.2.jpeg";
const BOTTLE_IMAGE_UPRIGHT = "/papad and pickle.2.jpeg";

export function BottleAnimation({
  isRolling = false,
  rollProgress = 0,
  isUpright = false,
  isFloating = false,
  className = ""
}: BottleAnimationProps) {
  const bottleRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Floating animation
  useEffect(() => {
    if (!isFloating || !bottleRef.current) return;
    
    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    tl.to(bottleRef.current, {
      y: -8,
      duration: 2,
      ease: "sine.inOut",
    });
    
    return () => {
      tl.kill();
    };
  }, [isFloating]);

  // Rolling rotation animation
  useEffect(() => {
    if (isRolling && imageRef.current) {
      // Full 360 rotation for one complete roll
      const rotation = rollProgress * 360;
      gsap.set(imageRef.current, {
        rotation: rotation,
        transformOrigin: "center center",
      });
    }
  }, [isRolling, rollProgress]);

  return (
    <div 
      ref={bottleRef}
      className={`relative ${className}`}
      style={{
        width: isUpright ? "180px" : "280px",
        height: isUpright ? "320px" : "180px",
      }}
    >
      {/* Bottle Container */}
      <div className="relative w-full h-full">
        {/* Pickle Bottle Image */}
        <motion.img
          ref={imageRef}
          src={BOTTLE_IMAGE_HORIZONTAL}
          alt="Babita's Kitchen Mango Pickle"
          className="w-full h-full object-contain"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            objectFit: "contain",
          }}
        />
        
        {/* Overlay for lid text - only visible when upright */}
        {isUpright && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative">
              {/* Carved/Embossed text effect on lid */}
              <div 
                className="absolute -top-16 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg"
                style={{
                  background: "linear-gradient(180deg, #c41e3a 0%, #a01830 50%, #8b1528 100%)",
                  boxShadow: `
                    inset 0 2px 4px rgba(255,255,255,0.3),
                    inset 0 -2px 4px rgba(0,0,0,0.3),
                    0 2px 8px rgba(0,0,0,0.3)
                  `,
                }}
              >
                <span 
                  className="text-white font-semibold whitespace-nowrap font-serif"
                  style={{
                    fontSize: "12px",
                    letterSpacing: "1px",
                    textShadow: `
                      0 1px 0 rgba(255,255,255,0.4),
                      0 -1px 0 rgba(0,0,0,0.4),
                      0 2px 2px rgba(0,0,0,0.3)
                    `,
                  }}
                >
                  Babita's Kitchen
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

