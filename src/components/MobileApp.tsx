import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, BookOpen, Smartphone, PlayCircle, ArrowLeft, Camera, Download } from "lucide-react";

const MobileApp = () => {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'upload' | 'scanner' | 'ar'>('home');

  const HomeScreen = () => (
    <div className="flex flex-col h-screen bg-gradient-hero text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-12">
        <h1 className="text-2xl font-bold">Memories</h1>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-white rounded-full"></div>
          <div className="w-2 h-2 bg-white/50 rounded-full"></div>
          <div className="w-2 h-2 bg-white/50 rounded-full"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center px-6 space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Transform school videos into magical AR experiences</h2>
          <p className="text-white/80 text-lg">Upload videos, generate beautiful album pages, and scan to bring memories to life</p>
        </div>

        {/* Process Steps */}
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
            <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">Upload Videos</h3>
              <p className="text-sm text-white/70">Add your school event videos</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
            <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">Generate Albums</h3>
              <p className="text-sm text-white/70">Create beautiful printable pages</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
            <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">Scan & Play</h3>
              <p className="text-sm text-white/70">Point camera at album page</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
            <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
              <PlayCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">AR Experience</h3>
              <p className="text-sm text-white/70">Watch videos come to life</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-6 space-y-3">
        <Button 
          className="w-full py-4 text-lg font-semibold bg-white text-primary hover:bg-white/90" 
          size="lg"
          onClick={() => setCurrentScreen('upload')}
        >
          Start Your School Demo
        </Button>
        <Button 
          variant="outline" 
          className="w-full py-4 text-lg border-white text-white hover:bg-white hover:text-primary" 
          size="lg"
          onClick={() => setCurrentScreen('scanner')}
        >
          Try AR Scanner
        </Button>
      </div>
    </div>
  );

  const UploadScreen = () => (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="flex items-center p-4 pt-12 border-b">
        <Button variant="ghost" size="icon" onClick={() => setCurrentScreen('home')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-semibold ml-4">Upload Videos</h1>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <Card className="p-8 text-center border-dashed border-2 border-primary/30">
          <Upload className="w-16 h-16 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Upload School Videos</h3>
          <p className="text-muted-foreground mb-6">Select videos from your gallery or record new ones</p>
          <Button className="w-full mb-3">
            <Camera className="w-4 h-4 mr-2" />
            Record New Video
          </Button>
          <Button variant="outline" className="w-full">
            <Upload className="w-4 h-4 mr-2" />
            Choose from Gallery
          </Button>
        </Card>
      </div>
    </div>
  );

  const ScannerScreen = () => (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-12">
        <Button variant="ghost" size="icon" onClick={() => setCurrentScreen('home')}>
          <ArrowLeft className="w-5 h-5 text-white" />
        </Button>
        <h1 className="text-xl font-semibold">AR Scanner</h1>
        <div></div>
      </div>

      {/* Camera View */}
      <div className="flex-1 relative bg-gradient-to-b from-gray-800 to-gray-900 flex items-center justify-center">
        <div className="w-64 h-48 border-2 border-white/50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <Camera className="w-12 h-12 mx-auto mb-2 text-white/70" />
            <p className="text-white/70">Point camera at album page</p>
          </div>
        </div>
        
        {/* Overlay corners */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-48">
          <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-secondary"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-secondary"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-secondary"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-secondary"></div>
        </div>
      </div>

      {/* Instructions */}
      <div className="p-6 text-center">
        <p className="text-white/80 mb-4">Hold steady and point at the QR code or marker on your printed album page</p>
        <Button 
          className="w-full py-3"
          onClick={() => setCurrentScreen('ar')}
        >
          <PlayCircle className="w-4 h-4 mr-2" />
          Simulate AR Experience
        </Button>
      </div>
    </div>
  );

  const ARScreen = () => (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-12">
        <Button variant="ghost" size="icon" onClick={() => setCurrentScreen('scanner')}>
          <ArrowLeft className="w-5 h-5 text-white" />
        </Button>
        <h1 className="text-xl font-semibold">AR Experience</h1>
        <div></div>
      </div>

      {/* AR View */}
      <div className="flex-1 relative bg-gradient-to-b from-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-48 h-36 bg-white/10 rounded-lg mb-4 flex items-center justify-center backdrop-blur-sm">
            <PlayCircle className="w-16 h-16 text-secondary animate-pulse" />
          </div>
          <p className="text-secondary font-semibold mb-2">🎉 Memory Detected!</p>
          <p className="text-white/80">Playing: Sports Day 2024</p>
        </div>

        {/* Floating elements */}
        <div className="absolute top-20 left-8 w-3 h-3 bg-secondary rounded-full animate-bounce"></div>
        <div className="absolute top-32 right-12 w-2 h-2 bg-accent rounded-full animate-pulse"></div>
        <div className="absolute bottom-32 left-16 w-4 h-4 bg-secondary/50 rounded-full animate-ping"></div>
      </div>

      {/* Controls */}
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-center gap-4">
          <Button size="icon" variant="secondary">
            <PlayCircle className="w-5 h-5" />
          </Button>
          <Button size="icon" variant="secondary">
            <Download className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-center text-white/60 text-sm">Tap to play video • Hold to download</p>
      </div>
    </div>
  );

  const screens = {
    'home': <HomeScreen />,
    'upload': <UploadScreen />,
    'scanner': <ScannerScreen />,
    'ar': <ARScreen />
  };

  return screens[currentScreen];
};

export default MobileApp;