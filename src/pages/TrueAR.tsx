import React from 'react';
import Navigation from '@/components/Navigation';
import WorkingTrueAR from '@/components/WorkingTrueAR';

const TrueAR = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">🎯 True AR Scanner</h1>
            <p className="text-muted-foreground mb-4">
              Real augmented reality - video overlays precisely on printed targets
            </p>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">🚀 Real AR Features:</h4>
              <ul className="text-green-700 text-sm space-y-1 text-left">
                <li>✅ <strong>True marker detection</strong> - recognizes your specific printed target</li>
                <li>✅ <strong>Perfect alignment</strong> - video appears exactly on the paper</li>  
                <li>✅ <strong>Real-time tracking</strong> - follows the paper as you move</li>
                <li>✅ <strong>Mobile browser support</strong> - no app installation needed</li>
                <li>✅ <strong>AR.js powered</strong> - industry-standard web AR</li>
              </ul>
            </div>
          </div>
          
          <WorkingTrueAR />
          
        </div>
      </main>
    </div>
  );
};

export default TrueAR;