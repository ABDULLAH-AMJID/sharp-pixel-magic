import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface ImageComparisonProps {
  originalImage: string;
  enhancedImage: string;
}

const ImageComparison = ({ originalImage, enhancedImage }: ImageComparisonProps) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMouseDown = useCallback(() => {
    isDragging.current = true;
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-4xl mx-auto aspect-video rounded-2xl overflow-hidden cursor-col-resize select-none glass animate-scale-in"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
    >
      {/* Enhanced image (background) */}
      <img
        src={enhancedImage}
        alt="Enhanced"
        className="absolute inset-0 w-full h-full object-contain bg-card"
      />
      
      {/* Original image (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          src={originalImage}
          alt="Original"
          className="absolute inset-0 w-full h-full object-contain bg-card"
          style={{ width: `${containerRef.current?.clientWidth}px` }}
        />
      </div>
      
      {/* Slider line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-primary glow-primary cursor-col-resize z-10"
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        {/* Slider handle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary flex items-center justify-center glow-primary shadow-lg">
          <div className="flex gap-0.5">
            <div className="w-0.5 h-4 bg-primary-foreground rounded-full" />
            <div className="w-0.5 h-4 bg-primary-foreground rounded-full" />
          </div>
        </div>
      </div>
      
      {/* Labels */}
      <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-background/80 backdrop-blur-sm text-xs font-medium text-muted-foreground border border-border">
        Original
      </div>
      <div className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-primary/20 backdrop-blur-sm text-xs font-medium text-primary border border-primary/30">
        Enhanced 8K
      </div>
    </div>
  );
};

export default ImageComparison;
