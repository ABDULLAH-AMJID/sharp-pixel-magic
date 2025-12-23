import { useCallback, useState } from "react";
import { Upload, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  onImageSelect: (file: File) => void;
  disabled?: boolean;
}

const UploadZone = ({ onImageSelect, disabled }: UploadZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled) return;

      const files = e.dataTransfer.files;
      if (files.length > 0 && files[0].type.startsWith("image/")) {
        onImageSelect(files[0]);
      }
    },
    [onImageSelect, disabled]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        onImageSelect(files[0]);
      }
    },
    [onImageSelect]
  );

  return (
    <div
      className={cn(
        "relative w-full max-w-2xl mx-auto aspect-video rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer group overflow-hidden",
        isDragging
          ? "border-primary bg-primary/10 scale-[1.02]"
          : "border-border hover:border-primary/50 hover:bg-card/50",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        disabled={disabled}
      />
      
      {/* Background grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background/80" />
      
      {/* Content */}
      <div className="relative z-0 flex flex-col items-center justify-center h-full gap-4 p-8">
        <div className={cn(
          "p-4 rounded-2xl transition-all duration-300",
          isDragging ? "bg-primary/20 glow-primary" : "bg-secondary group-hover:bg-primary/10"
        )}>
          {isDragging ? (
            <ImageIcon className="w-10 h-10 text-primary animate-pulse" />
          ) : (
            <Upload className="w-10 h-10 text-muted-foreground group-hover:text-primary transition-colors" />
          )}
        </div>
        
        <div className="text-center space-y-2">
          <p className="text-lg font-medium text-foreground">
            {isDragging ? "Drop your image here" : "Drag & drop your image"}
          </p>
          <p className="text-sm text-muted-foreground">
            or click to browse • PNG, JPG, WebP supported
          </p>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground/70">
          <span className="px-2 py-1 rounded-md bg-secondary">Max 10MB</span>
          <span className="px-2 py-1 rounded-md bg-secondary">Up to 8K output</span>
        </div>
      </div>
      
      {/* Animated border glow on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none glow-border" />
    </div>
  );
};

export default UploadZone;
