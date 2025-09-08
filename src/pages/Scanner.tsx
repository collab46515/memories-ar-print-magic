import React from 'react';
import Navigation from '@/components/Navigation';
import WorkingARScanner from '@/components/WorkingARScanner';

const Scanner = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">📱 AR Scanner</h1>
            <p className="text-muted-foreground mb-4">
              Point camera at printed page to watch embedded video
            </p>
          </div>
          
          <WorkingARScanner />
          
        </div>
      </main>
    </div>
  );
};

export default Scanner;