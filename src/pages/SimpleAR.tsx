import React from 'react';
import Navigation from '@/components/Navigation';
import SimpleARDetector from '@/components/SimpleARDetector';

const SimpleAR = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">🎯 Simple AR</h1>
            <p className="text-muted-foreground mb-4">
              Point camera at any object to overlay video (works reliably)
            </p>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">✨ Reliable AR Experience:</h4>
              <ol className="text-green-700 text-sm space-y-1 text-left">
                <li>1. 📱 Works on all mobile browsers</li>
                <li>2. 🎯 Detects any stable surface/object</li>  
                <li>3. 📊 Visual progress indicator</li>
                <li>4. 🎬 Video overlays when locked</li>
                <li>5. 🔊 Tap video for sound playback</li>
              </ol>
            </div>
          </div>
          
          <SimpleARDetector />
          
        </div>
      </main>
    </div>
  );
};

export default SimpleAR;