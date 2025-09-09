import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera as CameraIcon, Square } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BasicCameraTest = () => {
  const [isActive, setIsActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      console.log('📱 Testing basic camera access...');
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: false
      });

      console.log('✅ Camera access successful!');
      streamRef.current = stream;
      setIsActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('webkit-playsinline', 'true');
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        console.log('▶️ Camera video playing');
        
        toast({
          title: "Camera Working!",
          description: "Basic camera access is functional",
        });
      }
    } catch (error: any) {
      console.error('❌ Camera error:', error);
      toast({
        title: "Camera Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const stopCamera = () => {
    console.log('⏹️ Stopping camera');
    setIsActive(false);
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">📱 Basic Camera Test</h3>
        
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
                <p className="text-sm text-gray-600">Test basic camera access</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          {!isActive ? (
            <Button onClick={startCamera} className="flex-1">
              <CameraIcon className="w-4 h-4 mr-2" />
              Test Camera
            </Button>
          ) : (
            <Button onClick={stopCamera} variant="outline" className="flex-1">
              <Square className="w-4 h-4 mr-2" />
              Stop Camera
            </Button>
          )}
        </div>
      </Card>
      
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-2">🔍 What this tests:</h4>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• Camera permission on mobile browser</li>
          <li>• Video stream initialization</li>
          <li>• Basic playback functionality</li>
          <li>• Mobile-specific video attributes</li>
        </ul>
      </div>
    </div>
  );
};

export default BasicCameraTest;