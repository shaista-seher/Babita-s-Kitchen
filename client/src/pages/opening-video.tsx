import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";

export default function OpeningVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Mark that the video has been shown
    localStorage.setItem("hasSeenOpening", "true");

    const handleCanPlay = () => {
      setIsLoading(false);
      video.play().catch(console.error);
    };

    const handleEnded = () => {
      setLocation("/login");
    };

    const handleError = () => {
      console.error("Video error, redirecting to login");
      setLocation("/login");
    };

    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("error", handleError);

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("error", handleError);
    };
  }, [setLocation]);

  const handleSkip = () => {
    setLocation("/login");
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        playsInline
        muted
      >
        <source src="/opening-video.mp4" type="video/mp4" />
      </video>

      {/* Skip button */}
      <button
        onClick={handleSkip}
        className="absolute bottom-8 right-8 px-6 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium hover:bg-white/30 transition-colors"
      >
        Skip →
      </button>
    </div>
  );
}

