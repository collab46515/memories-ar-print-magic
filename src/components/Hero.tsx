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
      <div className="container relative z-10 mx-auto px-6 text-center text-white">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-float">
          Memories
        </h1>
        <p className="text-xl md:text-2xl mb-4 opacity-90 max-w-4xl mx-auto">
          Transform school videos into magical AR experiences
        </p>
        <p className="text-lg md:text-xl mb-12 opacity-80 max-w-3xl mx-auto">
          Upload videos, generate beautiful album pages, print them out, and watch parents scan to bring memories to life with audio and overlays
        </p>
        
        {/* Feature highlights */}
        <div className="grid md:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto">
          <div className="flex flex-col items-center space-y-2">
            <Upload className="w-8 h-8 text-secondary animate-pulse-glow" />
            <span className="text-sm opacity-90">Upload Videos</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <BookOpen className="w-8 h-8 text-secondary animate-pulse-glow" />
            <span className="text-sm opacity-90">Generate Albums</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <Smartphone className="w-8 h-8 text-secondary animate-pulse-glow" />
            <span className="text-sm opacity-90">Scan & Play</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <PlayCircle className="w-8 h-8 text-secondary animate-pulse-glow" />
            <span className="text-sm opacity-90">AR Experience</span>
          </div>
        </div>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button variant="hero" size="xl" className="min-w-[200px]">
            Start Your School Demo
          </Button>
          <Button variant="outline" size="xl" className="min-w-[200px] text-white border-white hover:bg-white hover:text-primary">
            Watch How It Works
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;