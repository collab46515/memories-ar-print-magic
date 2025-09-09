import React from 'react';
import Navigation from '@/components/Navigation';
import BasicCameraTest from '@/components/BasicCameraTest';

const CameraTest = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">📱 Camera Test</h1>
            <p className="text-muted-foreground mb-4">
              Test basic camera functionality before trying AR
            </p>
          </div>
          
          <BasicCameraTest />
          
        </div>
      </main>
    </div>
  );
};

export default CameraTest;