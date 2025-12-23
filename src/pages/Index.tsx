import { useState, useCallback } from "react";
import { Download, RefreshCw, Zap, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import UploadZone from "@/components/UploadZone";
import ImageComparison from "@/components/ImageComparison";
import ProcessingState from "@/components/ProcessingState";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type AppState = "idle" | "processing" | "complete";

const Index = () => {
  const [state, setState] = useState<AppState>("idle");
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handleImageSelect = useCallback(async (file: File) => {
    // Validate file size
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    // Read file as base64
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      setOriginalImage(base64);
      setState("processing");
      setProgress(0);

      // Simulate progress while waiting for API
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + Math.random() * 15, 90));
      }, 500);

      try {
        const { data, error } = await supabase.functions.invoke("upscale-image", {
          body: { image: base64 },
        });

        clearInterval(progressInterval);

        if (error) {
          throw error;
        }

        if (data?.error) {
          throw new Error(data.error);
        }

        setProgress(100);
        
        setTimeout(() => {
          setEnhancedImage(data.enhancedImage);
          setState("complete");
          toast.success("Image enhanced to 8K resolution!");
        }, 500);
      } catch (error) {
        clearInterval(progressInterval);
        console.error("Upscale error:", error);
        toast.error(error instanceof Error ? error.message : "Failed to enhance image. Please try again.");
        setState("idle");
        setOriginalImage(null);
        setProgress(0);
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const handleReset = useCallback(() => {
    setState("idle");
    setOriginalImage(null);
    setEnhancedImage(null);
    setProgress(0);
  }, []);

  const handleDownload = useCallback(() => {
    if (!enhancedImage) return;

    const link = document.createElement("a");
    link.href = enhancedImage;
    link.download = "enhanced-8k-image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Image downloaded successfully!");
  }, [enhancedImage]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 grid-pattern opacity-20 pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-glow-secondary/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10 container mx-auto px-4 py-12 md:py-20">
        {/* Header */}
        <header className="text-center space-y-4 mb-12 md:mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Enhancement</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            <span className="text-foreground">Upscale to </span>
            <span className="gradient-text">8K Resolution</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform any image into stunning 8K quality using advanced AI. 
            Enhance details, improve clarity, and bring your photos to life.
          </p>
        </header>

        {/* Main content */}
        <main className="space-y-8">
          {state === "idle" && (
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <UploadZone onImageSelect={handleImageSelect} />
            </div>
          )}

          {state === "processing" && (
            <ProcessingState progress={progress} />
          )}

          {state === "complete" && originalImage && enhancedImage && (
            <div className="space-y-6 animate-fade-in">
              <ImageComparison
                originalImage={originalImage}
                enhancedImage={enhancedImage}
              />
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button variant="hero" size="lg" onClick={handleDownload}>
                  <Download className="w-5 h-5" />
                  Download 8K Image
                </Button>
                <Button variant="glass" size="lg" onClick={handleReset}>
                  <RefreshCw className="w-5 h-5" />
                  Enhance Another
                </Button>
              </div>
            </div>
          )}
        </main>

        {/* Features */}
        {state === "idle" && (
          <section className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Get your enhanced image in seconds with our optimized AI pipeline",
              },
              {
                icon: Sparkles,
                title: "8K Quality",
                description: "Upscale any image up to 8K resolution with incredible detail preservation",
              },
              {
                icon: Shield,
                title: "Privacy First",
                description: "Your images are processed securely and never stored on our servers",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="glass rounded-2xl p-6 space-y-4 group hover:glow-border transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
};

export default Index;
