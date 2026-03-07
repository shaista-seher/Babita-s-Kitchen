import { motion } from "framer-motion";

interface BackgroundElementsProps {
  className?: string;
}

// Using actual papad images from public folder
const PAPAD_IMAGES = [
  "/papad.jpeg",
  "/papad and pickle.jpeg",
  "/papad and pickle.1.jpeg",
  "/papad and pickle.3.jpeg",
];

export function BackgroundElements({ className = "" }: BackgroundElementsProps) {
  // Papad chip positions - scattered around the screen
  const papadChips = [
    { x: "5%", y: "15%", rotate: -15, scale: 0.5, opacity: 0.4, image: 0 },
    { x: "85%", y: "10%", rotate: 20, scale: 0.4, opacity: 0.35, image: 1 },
    { x: "10%", y: "70%", rotate: 45, scale: 0.45, opacity: 0.3, image: 2 },
    { x: "90%", y: "65%", rotate: -30, scale: 0.42, opacity: 0.35, image: 3 },
    { x: "75%", y: "85%", rotate: 10, scale: 0.38, opacity: 0.3, image: 0 },
    { x: "20%", y: "85%", rotate: -25, scale: 0.4, opacity: 0.3, image: 1 },
    { x: "50%", y: "90%", rotate: 5, scale: 0.35, opacity: 0.25, image: 2 },
    { x: "3%", y: "45%", rotate: -40, scale: 0.38, opacity: 0.3, image: 3 },
    { x: "95%", y: "40%", rotate: 35, scale: 0.45, opacity: 0.3, image: 0 },
  ];

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Dark textured background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1512] via-[#2a1f1a] to-[#1a1512]" />
      
      {/* Subtle noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Vignette effect */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-[#1a1512]/50" />

      {/* Papad chips scattered around */}
      {papadChips.map((chip, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={{
            left: chip.x,
            top: chip.y,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: chip.opacity, 
            scale: chip.scale,
            rotate: chip.rotate,
          }}
          transition={{
            duration: 0.8,
            delay: index * 0.1,
            ease: "easeOut"
          }}
        >
          {/* Papad chip image */}
          <img 
            src={PAPAD_IMAGES[chip.image]} 
            alt="Papad"
            className="w-24 h-24 object-contain"
            style={{
              filter: 'brightness(0.9) contrast(1.1)',
            }}
          />
        </motion.div>
      ))}

      {/* Floating particles for atmosphere */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-amber-200/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}

