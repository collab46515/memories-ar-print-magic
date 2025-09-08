import React from 'react';
import Navigation from '@/components/Navigation';
import NFTARScanner from '@/components/NFTARScanner';

const NFTAR = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              NFT AR Scanner
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Advanced Natural Feature Tracking (NFT) AR that recognizes the actual album page 
              without artificial markers. More robust tracking for better mobile experience.
            </p>
          </div>
          
          <NFTARScanner />
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-semibold mb-2">🎯 Natural Tracking</h3>
              <p className="text-sm text-gray-600">
                Uses actual image features instead of artificial markers for more natural AR experience.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-semibold mb-2">📱 Mobile Optimized</h3>
              <p className="text-sm text-gray-600">
                Built specifically for mobile browsers with proper audio policies and performance.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-semibold mb-2">🔒 Stable Lock</h3>
              <p className="text-sm text-gray-600">
                Advanced tracking algorithms provide more stable marker detection and video overlay.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NFTAR;