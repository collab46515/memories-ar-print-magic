import React from 'react';
import Navigation from '@/components/Navigation';
import ARScanner from '@/components/ARScanner';

const Scanner = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">📱 AR Scanner</h1>
            <p className="text-muted-foreground mb-4">
              Point your camera at an AR target to watch the embedded video
            </p>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-sm">
              <p className="font-semibold text-blue-800 mb-2">📋 Quick Test Steps:</p>
              <ol className="text-blue-700 text-left space-y-1 max-w-md mx-auto">
                <li>1. ⬅️ Go back and upload a video</li>
                <li>2. 💾 Download the generated AR target</li>
                <li>3. 🖨️ Print it or display on another screen</li>
                <li>4. 📷 Return here and scan the target</li>
                <li>5. 🎬 Watch video overlay with audio!</li>
              </ol>
            </div>
          </div>
          
          <ARScanner />
          
          <div className="mt-8 space-y-4">
            <div className="bg-card p-4 rounded-lg border">
              <h3 className="font-semibold mb-2">📐 Optimal Scanning Conditions:</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  <h4 className="font-medium text-foreground mb-1">Distance & Angle:</h4>
                  <ul className="space-y-1">
                    <li>• Target fills 60-80% of camera view</li>
                    <li>• Keep tilt under 25°</li>
                    <li>• Hold device steady for 250ms lock</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Lighting & Print:</h4>
                  <ul className="space-y-1">
                    <li>• Avoid glare and harsh shadows</li>
                    <li>• Use 300 DPI, 100% scale print</li>
                    <li>• Indoor diffuse lighting works best</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <h3 className="font-semibold text-amber-800 mb-2">🔧 Troubleshooting:</h3>
              <div className="text-sm text-amber-700 space-y-2">
                <p><strong>No detection?</strong> Ensure target has high contrast and good lighting</p>
                <p><strong>Slow lock?</strong> Move closer so target fills more of the view</p>
                <p><strong>Video not playing?</strong> Tap the play button after green lock appears</p>
                <p><strong>No audio?</strong> Check device volume and browser audio permissions</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Scanner;