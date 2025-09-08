import React, { useState, useRef, useEffect } from 'react';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Camera as CameraIcon, Square, Target } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ARScannerProps {
  onVideoDetected?: (videoUrl: string) => void;
}

const ARScanner = ({ onVideoDetected }: ARScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [detectedVideo, setDetectedVideo] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [arTargets, setArTargets] = useState<any[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const arVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Load AR targets on component mount
  useEffect(() => {
    loadARTargets();
  }, []);

  const loadARTargets = async () => {
    try {
      const { data: albumPages, error } = await supabase
        .from('album_pages')
        .select('*')
        .not('ar_target_image_url', 'is', null);
      
      if (error) throw error;
      setArTargets(albumPages || []);
    } catch (error) {
      console.error('Error loading AR targets:', error);
    }
  };

  const startCamera = async () => {
    try {
      setIsScanning(true);
      
      if (Capacitor.isNativePlatform()) {
        // Native camera - capture and process single image
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: CameraResultType.DataUrl
        });
        
        await processImageForAR(image.dataUrl!);
      } else {
        // Web camera - continuous scanning
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        });
        streamRef.current = stream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          
          // Start continuous AR detection
          startContinuousDetection();
        }
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
    
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const startContinuousDetection = () => {
    detectionIntervalRef.current = setInterval(() => {
      if (isScanning && videoRef.current && canvasRef.current) {
        captureAndAnalyzeFrame();
      }
    }, 500); // Check every 500ms for better performance
  };

  const captureAndAnalyzeFrame = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Capture current frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert to data URL and analyze
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    await processImageForAR(dataUrl);
  };

  const processImageForAR = async (imageDataUrl: string) => {
    try {
      // Compare captured frame with stored AR targets
      for (const target of arTargets) {
        const similarity = await compareImages(imageDataUrl, target.ar_target_image_url);
        
        // If similarity above threshold, we found a match
        if (similarity > 0.6) { // 60% similarity threshold
          setDetectedVideo(target.video_url);
          onVideoDetected?.(target.video_url);
          
          toast({
            title: "AR Target Detected! 🎯",
            description: "Video locked onto target. Tap Play to watch.",
          });
          
          // Stop continuous detection when target found
          if (detectionIntervalRef.current) {
            clearInterval(detectionIntervalRef.current);
            detectionIntervalRef.current = null;
          }
          break;
        }
      }
    } catch (error) {
      console.error('Error processing AR image:', error);
    }
  };

  const compareImages = async (capturedImage: string, targetImageUrl: string): Promise<number> => {
    // Simple computer vision comparison using canvas
    // In production, use more sophisticated algorithms like ORB, SIFT, etc.
    
    return new Promise((resolve) => {
      const img1 = new Image();
      const img2 = new Image();
      let loadedCount = 0;
      
      const checkLoaded = () => {
        loadedCount++;
        if (loadedCount === 2) {
          const similarity = calculateImageSimilarity(img1, img2);
          resolve(similarity);
        }
      };
      
      img1.onload = checkLoaded;
      img2.onload = checkLoaded;
      
      img1.crossOrigin = 'anonymous';
      img2.crossOrigin = 'anonymous';
      
      img1.src = capturedImage;
      img2.src = targetImageUrl;
    });
  };

  const calculateImageSimilarity = (img1: HTMLImageElement, img2: HTMLImageElement): number => {
    const canvas1 = document.createElement('canvas');
    const canvas2 = document.createElement('canvas');
    const ctx1 = canvas1.getContext('2d')!;
    const ctx2 = canvas2.getContext('2d')!;
    
    // Resize both images to same size for comparison
    const size = 64; // Small size for fast comparison
    canvas1.width = canvas1.height = size;
    canvas2.width = canvas2.height = size;
    
    ctx1.drawImage(img1, 0, 0, size, size);
    ctx2.drawImage(img2, 0, 0, size, size);
    
    const data1 = ctx1.getImageData(0, 0, size, size);
    const data2 = ctx2.getImageData(0, 0, size, size);
    
    // Calculate pixel difference
    let totalDiff = 0;
    for (let i = 0; i < data1.data.length; i += 4) {
      const r1 = data1.data[i];
      const g1 = data1.data[i + 1];
      const b1 = data1.data[i + 2];
      
      const r2 = data2.data[i];
      const g2 = data2.data[i + 1];
      const b2 = data2.data[i + 2];
      
      const diff = Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2);
      totalDiff += diff;
    }
    
    // Convert to similarity percentage (0-1)
    const maxDiff = size * size * 3 * 255; // Max possible difference
    const similarity = 1 - (totalDiff / maxDiff);
    
    return Math.max(0, similarity);
  };

  const playARVideo = () => {
    setIsPlaying(true);
    
    if (arVideoRef.current && detectedVideo) {
      arVideoRef.current.src = detectedVideo;
      arVideoRef.current.play();
    }
    
    toast({
      title: "AR Video Playing! 🎬",
      description: "Video is now overlayed on the AR target.",
    });
  };

  const stopARVideo = () => {
    setIsPlaying(false);
    
    if (arVideoRef.current) {
      arVideoRef.current.pause();
      arVideoRef.current.currentTime = 0;
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
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Real AR Scanner</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Target className="w-4 h-4" />
            {arTargets.length} targets loaded
          </div>
        </div>
        
        <div className="relative aspect-video bg-secondary/20 rounded-lg overflow-hidden mb-4">
          {/* Camera Feed */}
          <video 
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            muted
          />
          
          {/* Hidden canvas for frame capture */}
          <canvas ref={canvasRef} className="hidden" />
          
          {/* AR Video Overlay */}
          {isPlaying && detectedVideo && (
            <div className="absolute inset-0 flex items-center justify-center">
              <video 
                ref={arVideoRef}
                className="w-3/4 h-3/4 object-cover rounded-lg shadow-lg border-4 border-primary"
                controls
                autoPlay
                playsInline
              />
            </div>
          )}
          
          {/* Scanning Overlay */}
          {isScanning && !detectedVideo && (
            <div className="absolute inset-0">
              <div className="absolute inset-4 border-2 border-primary/50 rounded-lg">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary animate-pulse"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary animate-pulse"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-primary/90 text-primary-foreground px-3 py-1 rounded text-sm">
                    Scanning for AR targets...
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Target Detected Overlay */}
          {detectedVideo && !isPlaying && (
            <div className="absolute inset-0 bg-green-500/20 border-4 border-green-500 animate-pulse">
              <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded text-sm font-semibold">
                🎯 AR TARGET LOCKED
              </div>
            </div>
          )}
          
          {/* No Camera State */}
          {!isScanning && !detectedVideo && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <CameraIcon className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Point camera at album page</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          {!isScanning ? (
            <Button onClick={startCamera} className="flex-1" disabled={arTargets.length === 0}>
              <CameraIcon className="w-4 h-4 mr-2" />
              {arTargets.length === 0 ? 'No AR Targets' : 'Start AR Scan'}
            </Button>
          ) : (
            <Button onClick={stopCamera} variant="outline" className="flex-1">
              <Square className="w-4 h-4 mr-2" />
              Stop Scanning
            </Button>
          )}
          
          {detectedVideo && !isPlaying && (
            <Button onClick={playARVideo} className="flex-1">
              <Play className="w-4 h-4 mr-2" />
              Play AR Video
            </Button>
          )}
          
          {isPlaying && (
            <Button onClick={stopARVideo} variant="outline" className="flex-1">
              <Square className="w-4 h-4 mr-2" />
              Stop Video
            </Button>
          )}
        </div>
      </Card>
      
      {detectedVideo && (
        <Card className="p-4 border-green-200 bg-green-50">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-semibold text-green-700">AR Target Detected & Locked</span>
          </div>
          <p className="text-xs text-green-600 mt-1">
            Video ready for AR overlay playback
          </p>
        </Card>
      )}
      
      {arTargets.length === 0 && (
        <Card className="p-4 border-amber-200 bg-amber-50">
          <div className="flex items-center gap-2 text-sm">
            <Target className="w-4 h-4 text-amber-600" />
            <span className="font-semibold text-amber-700">No AR Targets Available</span>
          </div>
          <p className="text-xs text-amber-600 mt-1">
            Upload a video first to generate AR targets for scanning
          </p>
        </Card>
      )}
    </div>
  );
};

export default ARScanner;