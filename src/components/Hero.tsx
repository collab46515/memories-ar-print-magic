import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-ar-education.jpg";
import { PlayCircle, Upload, Smartphone, BookOpen } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative bg-gradient-hero min-h-screen flex items-center overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Students using AR technology with printed albums" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-90"></div>
      </div>
      
      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 sm:px-6 text-center text-white">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 animate-float">
          Memories
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl mb-3 sm:mb-4 opacity-90 max-w-4xl mx-auto leading-tight">
          Transform school videos into magical AR experiences
        </p>
        <p className="text-sm sm:text-base md:text-lg mb-8 sm:mb-12 opacity-80 max-w-2xl md:max-w-3xl mx-auto leading-relaxed px-2">
          Upload videos, generate beautiful album pages, print them out, and watch parents scan to bring memories to life with audio and overlays
        </p>
        
        {/* Feature highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12 max-w-3xl md:max-w-4xl mx-auto px-2">
          <div className="flex flex-col items-center space-y-1 sm:space-y-2">
            <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-secondary animate-pulse-glow" />
            <span className="text-xs sm:text-sm opacity-90 text-center">Upload Videos</span>
          </div>
          <div className="flex flex-col items-center space-y-1 sm:space-y-2">
            <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-secondary animate-pulse-glow" />
            <span className="text-xs sm:text-sm opacity-90 text-center">Generate Albums</span>
          </div>
          <div className="flex flex-col items-center space-y-1 sm:space-y-2">
            <Smartphone className="w-6 h-6 sm:w-8 sm:h-8 text-secondary animate-pulse-glow" />
            <span className="text-xs sm:text-sm opacity-90 text-center">Scan & Play</span>
          </div>
          <div className="flex flex-col items-center space-y-1 sm:space-y-2">
            <PlayCircle className="w-6 h-6 sm:w-8 sm:h-8 text-secondary animate-pulse-glow" />
            <span className="text-xs sm:text-sm opacity-90 text-center">AR Experience</span>
          </div>
        </div>
        
        {/* CTA Buttons */}
        <div className="flex flex-col gap-3 sm:gap-4 justify-center items-center px-4 sm:px-0">
          <Button variant="hero" size="lg" className="w-full max-w-xs sm:max-w-sm">
            Start Your School Demo
          </Button>
          <Button variant="outline" size="lg" className="w-full max-w-xs sm:max-w-sm text-white border-white hover:bg-white hover:text-primary">
            Watch How It Works
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;