import React from 'react';
import Navigation from '@/components/Navigation';
import ARScanner from '@/components/ARScanner';

const Scanner = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">AR Scanner</h1>
            <p className="text-muted-foreground">
              Point your camera at an album page to watch the embedded video
            </p>
          </div>
          
          <ARScanner />
          
          <div className="mt-8 text-center">
            <div className="bg-card p-4 rounded-lg border">
              <h3 className="font-semibold mb-2">How to use:</h3>
              <ol className="text-sm text-muted-foreground text-left space-y-1">
                <li>1. Make sure you have printed an album page</li>
                <li>2. Tap "Start Scanning" to activate the camera</li>
                <li>3. Point your camera at the album page</li>
                <li>4. Wait for AR target detection</li>
                <li>5. Tap "Play Video" to watch the embedded content</li>
              </ol>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Scanner;