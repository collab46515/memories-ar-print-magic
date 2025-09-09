import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, BookOpen, Smartphone, PlayCircle, ArrowLeft, Camera, Download, Stars, Sparkles, Zap, Heart, CheckCircle, Clock, Users } from "lucide-react";

const MobileApp = () => {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'upload' | 'scanner' | 'ar'>('home');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [arDetected, setArDetected] = useState(false);

  const handleScreenChange = (screen: 'home' | 'upload' | 'scanner' | 'ar') => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentScreen(screen);
      setIsTransitioning(false);
    }, 200);
  };

  // Simulate scanning progress
  useEffect(() => {
    if (currentScreen === 'scanner') {
      const interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 2;
        });
      }, 50);
      return () => clearInterval(interval);
    } else {
      setScanProgress(0);
    }
  }, [currentScreen]);

  const HomeScreen = () => (
    <div className={`flex flex-col h-screen bg-gradient-hero text-white transition-all duration-300 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
      {/* Status Bar */}
      <div className="flex items-center justify-between p-4 pt-12">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-secondary animate-pulse" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            MemoriesAR
          </h1>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1 h-4 bg-white rounded-full"></div>
          <div className="w-1 h-3 bg-white/70 rounded-full"></div>
          <div className="w-1 h-2 bg-white/50 rounded-full"></div>
          <div className="w-4 h-2 bg-white rounded-full ml-1"></div>
        </div>
      </div>

      {/* Hero Content */}
      <div className="flex-1 flex flex-col justify-center px-6 space-y-8">
        <div className="text-center space-y-6 animate-fade-in">
          <div className="relative">
            <Stars className="absolute -top-4 -right-4 w-8 h-8 text-secondary animate-float" />
            <h2 className="text-4xl font-bold leading-tight">
              Transform School
              <br />
              <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                Memories into Magic
              </span>
            </h2>
            <Heart className="absolute -bottom-2 -left-4 w-6 h-6 text-secondary/70 animate-pulse" />
          </div>
          <p className="text-white/90 text-lg leading-relaxed px-4">
            Create magical AR experiences from school videos with our revolutionary platform
          </p>
        </div>

        {/* Enhanced Process Steps */}
        <div className="space-y-3">
          {[
            { icon: Upload, title: "Upload Videos", desc: "Add school event footage", color: "bg-gradient-to-br from-secondary to-secondary/80" },
            { icon: Zap, title: "AI Processing", desc: "Auto-generate album pages", color: "bg-gradient-to-br from-accent to-accent/80" },
            { icon: Smartphone, title: "Print & Share", desc: "Beautiful physical albums", color: "bg-gradient-to-br from-primary to-primary/80" },
            { icon: PlayCircle, title: "AR Magic", desc: "Scan to bring memories alive", color: "bg-gradient-to-br from-secondary to-accent" }
          ].map((step, index) => (
            <div 
              key={step.title}
              className="flex items-center gap-4 p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-14 h-14 ${step.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                <step.icon className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{step.title}</h3>
                <p className="text-sm text-white/70">{step.desc}</p>
              </div>
              <div className="w-6 h-6 border-2 border-white/30 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Bottom Actions */}
      <div className="p-6 space-y-4">
        <Button 
          className="w-full py-6 text-lg font-semibold bg-white text-primary hover:bg-white/95 hover:scale-105 transition-all duration-200 shadow-xl" 
          size="lg"
          onClick={() => handleScreenChange('upload')}
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Start Creating Magic
        </Button>
        <Button 
          variant="outline" 
          className="w-full py-6 text-lg border-white/30 text-white hover:bg-white/10 hover:border-white hover:scale-105 transition-all duration-200 backdrop-blur-sm" 
          size="lg"
          onClick={() => handleScreenChange('scanner')}
        >
          <Camera className="w-5 h-5 mr-2" />
          Try AR Scanner
        </Button>
        
        {/* Stats */}
        <div className="flex items-center justify-center gap-6 pt-4 text-white/60">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span className="text-sm">1K+ Schools</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            <span className="text-sm">50K+ Memories</span>
          </div>
        </div>
      </div>
    </div>
  );

  const UploadScreen = () => (
    <div className={`flex flex-col h-screen bg-background transition-all duration-300 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
      {/* Enhanced Header */}
      <div className="flex items-center p-4 pt-12 border-b bg-gradient-to-r from-primary/5 to-secondary/5">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => handleScreenChange('home')}
          className="hover:bg-primary/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="ml-4">
          <h1 className="text-xl font-semibold">Upload Videos</h1>
          <p className="text-sm text-muted-foreground">Step 1 of 3</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-muted h-1">
        <div className="h-full bg-gradient-to-r from-primary to-secondary w-1/3 transition-all duration-500"></div>
      </div>

      {/* Enhanced Content */}
      <div className="flex-1 p-6 space-y-6">
        <Card className="p-8 text-center border-dashed border-2 border-primary/30 hover:border-primary/50 transition-colors bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="relative mb-6">
            <Upload className="w-20 h-20 text-primary mx-auto animate-float" />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-semibold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Upload School Videos
          </h3>
          <p className="text-muted-foreground mb-8 text-lg">
            Select videos from your gallery or record new ones to create magical AR experiences
          </p>
          
          <div className="space-y-4">
            <Button className="w-full py-4 text-lg hover:scale-105 transition-all duration-200 shadow-lg">
              <Camera className="w-5 h-5 mr-3" />
              Record New Video
            </Button>
            <Button variant="outline" className="w-full py-4 text-lg hover:scale-105 transition-all duration-200">
              <Upload className="w-5 h-5 mr-3" />
              Choose from Gallery
            </Button>
          </div>
        </Card>

        {/* Recent Videos */}
        <div className="space-y-4">
          <h4 className="font-semibold text-lg">Recent Videos</h4>
          <div className="grid grid-cols-2 gap-4">
            {['Sports Day', 'Science Fair', 'Art Show'].map((event, index) => (
              <Card key={event} className="p-4 hover:shadow-md transition-all duration-200 hover:scale-105">
                <div className="w-full h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg mb-3 flex items-center justify-center">
                  <PlayCircle className="w-8 h-8 text-primary" />
                </div>
                <p className="font-medium text-sm">{event}</p>
                <p className="text-xs text-muted-foreground">2 min ago</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const ScannerScreen = () => (
    <div className={`flex flex-col h-screen bg-black text-white transition-all duration-300 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
      {/* Enhanced Header */}
      <div className="flex items-center justify-between p-4 pt-12 bg-gradient-to-r from-black to-gray-900/50">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => handleScreenChange('home')}
          className="text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="text-center">
          <h1 className="text-xl font-semibold">AR Scanner</h1>
          <p className="text-xs text-white/60">Position album page in frame</p>
        </div>
        <div className="w-10"></div>
      </div>

      {/* Enhanced Camera View */}
      <div className="flex-1 relative bg-gradient-to-b from-gray-900 via-black to-gray-900 flex items-center justify-center overflow-hidden">
        {/* Scanning Animation */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-1 bg-gradient-to-r from-transparent via-secondary to-transparent animate-pulse"></div>
        </div>

        {/* Camera Frame */}
        <div className="relative">
          <div className="w-72 h-52 border-2 border-white/30 rounded-2xl flex items-center justify-center backdrop-blur-sm bg-white/5">
            <div className="text-center space-y-4">
              <Camera className="w-16 h-16 mx-auto text-white/70 animate-pulse" />
              <div className="space-y-2">
                <p className="text-white/90 font-medium">Point camera at album page</p>
                <div className="w-32 h-2 bg-white/20 rounded-full mx-auto overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-secondary to-accent transition-all duration-100"
                    style={{ width: `${scanProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-white/60">Scanning... {scanProgress}%</p>
              </div>
            </div>
          </div>
          
          {/* Enhanced Overlay corners */}
          <div className="absolute inset-0">
            {[
              'top-0 left-0 border-l-4 border-t-4',
              'top-0 right-0 border-r-4 border-t-4', 
              'bottom-0 left-0 border-l-4 border-b-4',
              'bottom-0 right-0 border-r-4 border-b-4'
            ].map((position, index) => (
              <div 
                key={index}
                className={`absolute w-12 h-12 ${position} border-secondary animate-pulse`}
                style={{ animationDelay: `${index * 200}ms` }}
              ></div>
            ))}
          </div>

          {/* Success Animation */}
          {scanProgress >= 100 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center animate-scale-in">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
            </div>
          )}
        </div>

        {/* Floating Particles */}
        <div className="absolute top-20 left-8 w-2 h-2 bg-secondary rounded-full animate-float"></div>
        <div className="absolute top-32 right-16 w-1 h-1 bg-accent rounded-full animate-pulse"></div>
        <div className="absolute bottom-40 left-20 w-3 h-3 bg-secondary/50 rounded-full animate-bounce"></div>
      </div>

      {/* Enhanced Instructions */}
      <div className="p-6 text-center space-y-6 bg-gradient-to-t from-black to-transparent">
        <div className="space-y-2">
          <p className="text-white/90 text-lg font-medium">
            {scanProgress < 100 ? 'Hold steady and scan the QR code' : 'Album page detected!'}
          </p>
          <p className="text-white/60 text-sm">
            {scanProgress < 100 ? 'Make sure the entire page is visible' : 'Ready to experience the magic'}
          </p>
        </div>
        
        <Button 
          className={`w-full py-4 text-lg transition-all duration-300 ${
            scanProgress >= 100 
              ? 'bg-gradient-to-r from-secondary to-accent hover:scale-105 animate-pulse' 
              : 'bg-white/10 text-white/50'
          }`}
          onClick={() => scanProgress >= 100 && handleScreenChange('ar')}
          disabled={scanProgress < 100}
        >
          <PlayCircle className="w-5 h-5 mr-2" />
          {scanProgress >= 100 ? 'Launch AR Experience' : 'Scanning...'}
        </Button>
      </div>
    </div>
  );

  const ARScreen = () => {
    useEffect(() => {
      const timer = setTimeout(() => setArDetected(true), 500);
      return () => clearTimeout(timer);
    }, []);

    return (
      <div className={`flex flex-col h-screen bg-black text-white transition-all duration-300 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        {/* Enhanced Header */}
        <div className="flex items-center justify-between p-4 pt-12 bg-gradient-to-r from-black to-purple-900/30">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => handleScreenChange('scanner')}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-xl font-semibold">AR Experience</h1>
            <p className="text-xs text-secondary">Live View</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <Clock className="w-4 h-4" />
          </div>
        </div>

        {/* Enhanced AR View */}
        <div className="flex-1 relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center overflow-hidden">
          {/* Magical Background Effects */}
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-20 h-20 bg-secondary/20 rounded-full blur-xl animate-float"></div>
            <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent/20 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-primary/20 rounded-full blur-lg animate-bounce"></div>
          </div>

          {/* AR Content */}
          <div className={`text-center transition-all duration-700 ${arDetected ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
            <div className="relative mb-8">
              <div className="w-56 h-40 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 shadow-2xl">
                <PlayCircle className="w-20 h-20 text-secondary animate-pulse-glow" />
              </div>
              
              {/* Holographic Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-pulse"></div>
              
              {/* Video Info Overlay */}
              <div className="absolute bottom-2 left-2 right-2 bg-black/50 rounded-lg p-3 backdrop-blur-sm">
                <p className="text-xs text-white/80">Sports Day 2024 • 2:34</p>
                <div className="w-full h-1 bg-white/20 rounded-full mt-1">
                  <div className="w-1/3 h-full bg-secondary rounded-full"></div>
                </div>
              </div>
            </div>
            
            {/* Success Message */}
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="w-6 h-6 text-secondary animate-spin" />
                <p className="text-secondary font-bold text-lg">Memory Unlocked!</p>
                <Sparkles className="w-6 h-6 text-secondary animate-spin" />
              </div>
              <p className="text-white/90 text-lg font-medium">Sports Day Championship</p>
              <p className="text-white/60">Tap to play this magical memory</p>
            </div>
          </div>

          {/* Enhanced Floating elements */}
          <div className="absolute top-16 left-12 w-4 h-4 bg-secondary rounded-full animate-float" style={{ animationDelay: '0s' }}></div>
          <div className="absolute top-28 right-16 w-3 h-3 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-40 left-20 w-5 h-5 bg-primary/70 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-40 left-1/4 w-2 h-2 bg-secondary/60 rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
          
          {/* Magic Sparkles */}
          {[...Array(6)].map((_, i) => (
            <div 
              key={i}
              className={`absolute w-1 h-1 bg-white rounded-full animate-pulse`}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.3}s`
              }}
            ></div>
          ))}
        </div>

        {/* Enhanced Controls */}
        <div className="p-6 space-y-6 bg-gradient-to-t from-black via-black/90 to-transparent">
          <div className="flex items-center justify-center gap-6">
            <Button size="lg" className="bg-gradient-to-r from-secondary to-accent hover:scale-110 transition-all duration-200 shadow-xl">
              <PlayCircle className="w-6 h-6 mr-2" />
              Play Video
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:scale-110 transition-all duration-200">
              <Download className="w-6 h-6 mr-2" />
              Save
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:scale-110 transition-all duration-200">
              <Heart className="w-6 h-6" />
            </Button>
          </div>
          
          <div className="text-center space-y-2">
            <p className="text-white/80 text-sm font-medium">Immersive AR Experience</p>
            <p className="text-white/50 text-xs">Tap controls • Move device to explore • Share memories</p>
          </div>
          
          {/* Action Bar */}
          <div className="flex items-center justify-between bg-white/5 rounded-2xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-secondary to-accent rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Magic Mode Active</p>
                <p className="text-xs text-white/60">3D Audio Enabled</p>
              </div>
            </div>
            <Button size="sm" variant="secondary" className="hover:scale-105 transition-transform">
              Share
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const screens = {
    'home': <HomeScreen />,
    'upload': <UploadScreen />,
    'scanner': <ScannerScreen />,
    'ar': <ARScreen />
  };

  return (
    <div className="max-w-sm mx-auto bg-black overflow-hidden">
      {screens[currentScreen]}
    </div>
  );
};

export default MobileApp;