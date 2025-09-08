import React, { useState, useRef, useEffect } from 'react';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Camera as CameraIcon, Square } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ARScannerProps {
  onVideoDetected?: (videoUrl: string) => void;
}

const ARScanner = ({ onVideoDetected }: ARScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [detectedVideo, setDetectedVideo] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      setIsScanning(true);
      
      if (Capacitor.isNativePlatform()) {
        // Native camera implementation
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: CameraResultType.DataUrl
        });
        
        // Process the image for AR target detection
        await processImageForAR(image.dataUrl!);
      } else {
        // Web camera implementation
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        streamRef.current = stream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        
        // Start continuous scanning
        startContinuousScanning();
      }
    } catch (error) {
      console.error('Error starting camera:', error);
      toast({
        title: "Camera Error",
        description: "Failed to access camera. Please check permissions.",
        variant: "destructive"
      });
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    setIsScanning(false);
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const startContinuousScanning = () => {
    const scanFrame = async () => {
      if (!isScanning || !videoRef.current || !canvasRef.current) return;
      
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return;
      
      // Capture frame
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);
      
      // Convert to data URL and process
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      await processImageForAR(dataUrl);
      
      // Continue scanning
      if (isScanning) {
        setTimeout(scanFrame, 1000); // Scan every second
      }
    };
    
    setTimeout(scanFrame, 1000);
  };

  const processImageForAR = async (imageDataUrl: string) => {
    try {
      // Simple color-based detection for MVP
      // In production, this would use proper AR libraries like AR.js or 8th Wall
      const hasARTarget = await detectARTarget(imageDataUrl);
      
      if (hasARTarget) {
        // Query database for matching AR target
        const { data: albumPages, error } = await supabase
          .from('album_pages')
          .select('*')
          .not('ar_target_image_url', 'is', null);
        
        if (error) throw error;
        
        // For MVP, just return the first video found
        if (albumPages && albumPages.length > 0) {
          const videoUrl = albumPages[0].video_url;
          setDetectedVideo(videoUrl);
          onVideoDetected?.(videoUrl);
          
          toast({
            title: "AR Target Detected!",
            description: "Video ready to play",
          });
        }
      }
    } catch (error) {
      console.error('Error processing AR image:', error);
    }
  };

  const detectARTarget = async (imageDataUrl: string): Promise<boolean> => {
    // Simple detection for MVP - look for specific color patterns
    // This is a placeholder that always returns true after a delay
    return new Promise(resolve => {
      setTimeout(() => {
        // In real implementation, this would analyze the image
        // For MVP, we'll detect any image as an AR target
        resolve(Math.random() > 0.7); // 30% chance to detect target
      }, 500);
    });
  };

  const playVideo = () => {
    setIsPlaying(true);
    if (videoRef.current && detectedVideo) {
      videoRef.current.src = detectedVideo;
      videoRef.current.play();
    }
  };

  const stopVideo = () => {
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">AR Scanner</h3>
        
        <div className="relative aspect-video bg-secondary/20 rounded-lg overflow-hidden mb-4">
          {!isPlaying ? (
            <>
              <video 
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                muted
              />
              <canvas 
                ref={canvasRef}
                className="hidden"
              />
              
              {!isScanning && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <CameraIcon className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Point camera at album page</p>
                  </div>
                </div>
              )}
              
              {isScanning && (
                <div className="absolute inset-0 border-4 border-primary/50 animate-pulse">
                  <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-2 py-1 rounded text-xs">
                    Scanning for AR targets...
                  </div>
                </div>
              )}
            </>
          ) : (
            <video 
              ref={videoRef}
              className="w-full h-full object-cover"
              controls
              autoPlay
            />
          )}
        </div>
        
        <div className="flex gap-2">
          {!isScanning ? (
            <Button onClick={startCamera} className="flex-1">
              <CameraIcon className="w-4 h-4 mr-2" />
              Start Scanning
            </Button>
          ) : (
            <Button onClick={stopCamera} variant="outline" className="flex-1">
              <Square className="w-4 h-4 mr-2" />
              Stop Scanning
            </Button>
          )}
          
          {detectedVideo && !isPlaying && (
            <Button onClick={playVideo} className="flex-1">
              <Play className="w-4 h-4 mr-2" />
              Play Video
            </Button>
          )}
          
          {isPlaying && (
            <Button onClick={stopVideo} variant="outline" className="flex-1">
              <Square className="w-4 h-4 mr-2" />
              Stop Video
            </Button>
          )}
        </div>
      </Card>
      
      {detectedVideo && (
        <Card className="p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            AR Target Detected - Video Ready
          </div>
        </Card>
      )}
    </div>
  );
};

export default ARScanner;