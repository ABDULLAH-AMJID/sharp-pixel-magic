import { Sparkles } from "lucide-react";

interface ProcessingStateProps {
  progress: number;
}

const ProcessingState = ({ progress }: ProcessingStateProps) => {
  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
      <div className="glass rounded-2xl p-8 space-y-6">
        {/* Icon and title */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center animate-pulse-glow">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            {/* Orbiting dots */}
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
              <div className="absolute -top-1 left-1/2 w-2 h-2 rounded-full bg-primary" />
            </div>
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '4s', animationDirection: 'reverse' }}>
              <div className="absolute -right-1 top-1/2 w-1.5 h-1.5 rounded-full bg-glow-secondary" />
            </div>
          </div>
          
          <div className="text-center space-y-1">
            <h3 className="text-xl font-semibold text-foreground">Enhancing to 8K</h3>
            <p className="text-sm text-muted-foreground">AI is analyzing and upscaling your image</p>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="space-y-2">
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-primary to-glow-secondary transition-all duration-300 relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 animate-shimmer" />
            </div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Processing...</span>
            <span className="font-mono">{Math.round(progress)}%</span>
          </div>
        </div>
        
        {/* Status steps */}
        <div className="space-y-2">
          {[
            { label: "Analyzing image structure", threshold: 0 },
            { label: "Enhancing details", threshold: 30 },
            { label: "Upscaling resolution", threshold: 60 },
            { label: "Finalizing 8K output", threshold: 85 },
          ].map((step, index) => (
            <div
              key={index}
              className={`flex items-center gap-2 text-sm transition-all duration-300 ${
                progress >= step.threshold ? "text-foreground" : "text-muted-foreground/50"
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full transition-colors ${
                progress >= step.threshold ? "bg-primary" : "bg-muted-foreground/30"
              }`} />
              <span>{step.label}</span>
              {progress >= step.threshold && progress < (step.threshold + 30) && (
                <span className="text-primary animate-pulse">...</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProcessingState;
