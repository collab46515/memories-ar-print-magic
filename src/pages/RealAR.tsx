import React from 'react';
import Navigation from '@/components/Navigation';
import ARScanner from '@/components/ARScanner';

const RealAR = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">🎯 Real AR Scanner</h1>
            <p className="text-muted-foreground mb-4">
              Scan the actual printed AR target to see video overlaid on paper
            </p>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">📋 How Real AR Works:</h4>
              <ol className="text-blue-700 text-sm space-y-1 text-left">
                <li>1. 🖨️ Print the AR target image you generated</li>
                <li>2. 📱 Point camera at the printed target</li>  
                <li>3. 🔍 Scanner detects and tracks the specific image</li>
                <li>4. 🎬 Video overlays precisely on the printed page</li>
                <li>5. 📐 Video follows the paper as you move camera</li>
              </ol>
            </div>
          </div>
          
          <ARScanner />
          
        </div>
      </main>
    </div>
  );
};

export default RealAR;