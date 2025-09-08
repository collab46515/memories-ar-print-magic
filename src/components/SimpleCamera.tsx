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
      console.log('🎬 Starting simple camera test...');
      setErrorMessage('');
      setIsActive(true);

      // Very basic camera request
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });

      console.log('✅ Camera stream obtained');
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Add event listeners
        videoRef.current.onloadedmetadata = () => {
          console.log('📹 Video metadata loaded');
        };

        videoRef.current.oncanplay = () => {
          console.log('📹 Video can play');
          videoRef.current?.play().then(() => {
            console.log('▶️ Video playing successfully');
            toast({
              title: "Camera Working! 📹",
              description: "Camera stream is active"
            });
          }).catch(err => {
            console.error('❌ Video play error:', err);
            setErrorMessage(`Play error: ${err.message}`);
          });
        };

        videoRef.current.onerror = (err) => {
          console.error('❌ Video element error:', err);
          setErrorMessage('Video element error');
        };
      }

    } catch (error: any) {
      console.error('❌ Camera error:', error);
      setErrorMessage(`Camera error: ${error.message}`);
      toast({
        title: "Camera Failed",
        description: error.message,
        variant: "destructive"
      });
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
            <Button onClick={startCamera} className="w-full">
              <CameraIcon className="w-4 h-4 mr-2" />
              Start Simple Camera
            </Button>
          ) : (
            <Button onClick={stopCamera} variant="destructive" className="w-full">
              <Square className="w-4 h-4 mr-2" />
              Stop Camera
            </Button>
          )}
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