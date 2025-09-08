import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera as CameraIcon, Square } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SimpleCamera = () => {
  const [isActive, setIsActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      // Immediate visual feedback
      alert('Button clicked! Starting camera test...');
      console.log('🎬 Button clicked - starting camera test');
      
      setErrorMessage('');
      setIsActive(true);

      // Check if getUserMedia is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('getUserMedia not supported in this browser');
      }

      console.log('📱 getUserMedia is available');
      
      // Very basic camera request
      console.log('🎥 Requesting camera access...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });

      console.log('✅ Camera stream obtained, tracks:', stream.getTracks().length);
      streamRef.current = stream;

      if (videoRef.current) {
        console.log('📺 Setting video source...');
        videoRef.current.srcObject = stream;
        
        // Simple play attempt
        try {
          await videoRef.current.play();
          console.log('▶️ Video playing!');
          alert('Success! Camera is working!');
        } catch (playError) {
          console.error('❌ Play failed:', playError);
          alert(`Play failed: ${playError.message}`);
        }
      }

    } catch (error: any) {
      console.error('❌ Camera error:', error);
      alert(`Camera failed: ${error.message}`);
      setErrorMessage(`Camera error: ${error.message}`);
      setIsActive(false);
    }
  };

  const stopCamera = () => {
    console.log('⏹️ Stopping camera');
    setIsActive(false);
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log('🛑 Track stopped:', track.kind);
      });
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Simple Camera Test</h3>
        
        <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden mb-4">
          <video 
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            muted
            autoPlay
          />
          
          {!isActive && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <CameraIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Camera not active</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          {!isActive ? (
            <Button 
              onClick={() => {
                console.log('🔴 Button clicked!');
                startCamera();
              }} 
              className="w-full"
            >
              <CameraIcon className="w-4 h-4 mr-2" />
              Start Simple Camera
            </Button>
          ) : (
            <Button onClick={stopCamera} variant="destructive" className="w-full">
              <Square className="w-4 h-4 mr-2" />
              Stop Camera
            </Button>
          )}
          
          {/* Test button to verify JavaScript is working */}
          <Button 
            onClick={() => {
              alert('JavaScript is working!');
              console.log('✅ Test button works');
            }}
            variant="outline"
            className="w-full"
          >
            🧪 Test JavaScript
          </Button>
        </div>
        
        {errorMessage && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
            <p className="text-red-800 text-sm">
              <strong>Error:</strong> {errorMessage}
            </p>
          </div>
        )}
        
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <p className="text-blue-800 text-sm">
            <strong>Debug Instructions:</strong>
          </p>
          <ol className="text-blue-700 text-xs mt-1 space-y-1">
            <li>1. Open browser dev tools (F12)</li>
            <li>2. Go to Console tab</li>
            <li>3. Click "Start Simple Camera"</li>
            <li>4. Watch for console messages</li>
            <li>5. Allow camera permission if prompted</li>
          </ol>
        </div>
      </Card>
    </div>
  );
};

export default SimpleCamera;