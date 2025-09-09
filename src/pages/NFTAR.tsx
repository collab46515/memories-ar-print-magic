import React from 'react';
import Navigation from '@/components/Navigation';
import WorkingARScanner from '@/components/WorkingARScanner';

const NFTAR = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">📱 Mobile AR Scanner</h1>
            <p className="text-muted-foreground mb-4">
              Point camera at printed page to watch embedded video - optimized for mobile app
            </p>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">🚀 Mobile App Features:</h4>
              <ul className="text-green-700 text-sm space-y-1 text-left">
                <li>✅ <strong>Native camera access</strong> - full camera control</li>
                <li>✅ <strong>Reliable AR tracking</strong> - no browser limitations</li>  
                <li>✅ <strong>Better performance</strong> - native mobile optimization</li>
                <li>✅ <strong>Stable video overlay</strong> - smooth playback</li>
              </ul>
            </div>
          </div>
          
          <WorkingARScanner />
          
        </div>
      </main>
    </div>
  );
};

export default NFTAR;