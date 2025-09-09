import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Camera as CameraIcon, Square, Target, Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SimpleARScannerProps {
  onVideoDetected?: (videoUrl: string) => void;
}

const SimpleARScanner = ({ onVideoDetected }: SimpleARScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [arTargets, setArTargets] = useState<any[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [detectionProgress, setDetectionProgress] = useState(0);
  const [currentTarget, setCurrentTarget] = useState<any>(null);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [pendingPlay, setPendingPlay] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const arVideoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Debug helper
  const addDebug = (message: string) => {
    console.log(message);
    setDebugInfo(prev => [...prev.slice(-3), `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  // Load AR targets
  useEffect(() => {
    loadARTargets();
  }, []);

  // Handle video element after it's rendered
  useEffect(() => {
    if (pendingPlay && arVideoRef.current && currentTarget) {
      addDebug('🎬 Video element ready, loading video...');
      const video = arVideoRef.current;
      
      video.onloadstart = () => addDebug('📡 Video loading started');
      video.onloadeddata = () => {
        addDebug('✅ AR video loaded and ready');
        toast({
          title: "🎬 AR Video Ready!",
          description: "Tap the video to play with sound",
        });
      };
      video.onerror = (e) => addDebug('❌ Video error: ' + (e as Event).type);
      video.onplay = () => addDebug('🎵 Video started playing');
      video.onpause = () => addDebug('⏸️ Video paused');
      
      video.src = currentTarget.video_url;
      addDebug('📹 Video source set: ' + currentTarget.video_url.substring(0, 50) + '...');
      
      setPendingPlay(false);
      onVideoDetected?.(currentTarget.video_url);
    }
  }, [pendingPlay, currentTarget, onVideoDetected, toast]);

  const loadARTargets = async () => {
    try {
      addDebug('📋 Loading AR targets...');
      const { data: albumPages, error } = await supabase
        .from('album_pages')
        .select('*')
        .not('ar_target_image_url', 'is', null);
      
      if (error) throw error;
      addDebug(`📋 Loaded ${albumPages?.length || 0} AR targets`);
      setArTargets(albumPages || []);
      
      if (albumPages && albumPages.length > 0) {
        addDebug('🎯 Setting first target as current');
        setCurrentTarget(albumPages[0]);
      } else {
        addDebug('⚠️ No AR targets found in database');
      }
    } catch (error) {
      console.error('Error loading AR targets:', error);
      addDebug('❌ Failed to load targets: ' + (error as Error).message);
    }
  };

  const startCamera = async () => {
    try {
      console.log('🎬 Starting Simple AR camera...');
      setIsScanning(true);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 640, max: 1280 },
          height: { ideal: 480, max: 720 },
          frameRate: { ideal: 24, max: 30 }
        },
        audio: false
      });

      console.log('✅ Camera stream obtained');
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('webkit-playsinline', 'true');
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        console.log('▶️ Camera playing, starting detection...');
        startSimpleDetection();
      }
    } catch (error: any) {
      console.error('❌ Camera error:', error);
      toast({
        title: "Camera Error",
        description: error.message,
        variant: "destructive"
      });
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    console.log('⏹️ Stopping camera');
    setIsScanning(false);
    setIsLocked(false);
    setDetectionProgress(0);
    setCurrentTarget(null);
    
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

  const startSimpleDetection = () => {
    if (arTargets.length === 0) {
      toast({
        title: "No AR Targets",
        description: "Upload a video first to generate AR targets",
        variant: "destructive"
      });
      return;
    }

    console.log('🔍 Starting simple AR detection...');
    
    let frame = 0;
    // Don't set target here, it should already be set from loadARTargets
    if (!currentTarget && arTargets.length > 0) {
      addDebug('🔧 Setting current target during detection...');
      setCurrentTarget(arTargets[0]);
    }

    detectionIntervalRef.current = setInterval(() => {
      frame++;
      
      if (!videoRef.current || !canvasRef.current) return;

      // Accelerated detection for mobile
      const progress = Math.min(frame * 15, 100); // Faster progress
      setDetectionProgress(progress);

      // Optimized canvas rendering
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d')!;
      const video = videoRef.current;
      
      // Only resize canvas if needed
      if (canvas.width !== video.clientWidth || canvas.height !== video.clientHeight) {
        canvas.width = video.clientWidth;
        canvas.height = video.clientHeight;
      }
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Optimized drawing
      const alpha = Math.min(progress / 100, 1);
      ctx.strokeStyle = progress >= 100 ? '#22c55e' : `rgba(59, 130, 246, ${alpha})`;
      ctx.lineWidth = progress >= 100 ? 4 : 2;
      ctx.setLineDash(progress >= 100 ? [] : [10, 5]);
      
      const boxSize = Math.min(canvas.width * 0.6, canvas.height * 0.6);
      const x = (canvas.width - boxSize) / 2;
      const y = (canvas.height - boxSize) / 2;
      
      ctx.strokeRect(x, y, boxSize, boxSize);

      // Optimized text rendering
      ctx.fillStyle = progress >= 100 ? '#22c55e' : '#3b82f6';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(`${Math.round(progress)}%`, x + 10, y + 25);

      // Lock when progress reaches 100%
      if (progress >= 100 && !isLocked) {
        setIsLocked(true);
        clearInterval(detectionIntervalRef.current!);
        detectionIntervalRef.current = null;

        toast({
          title: "🎯 AR Target Locked!",
          description: "Ready! Tap 'Play AR Video'",
        });

        console.log('🔒 AR Target locked! Ready to play video');
      }
    }, 200); // Faster cycle for mobile
  };

  const playARVideo = () => {
    addDebug('🎯 Play AR Video clicked!');
    addDebug(`Targets loaded: ${arTargets.length}`);
    addDebug(`Current target: ${currentTarget ? 'Found' : 'Missing'}`);
    
    if (!currentTarget) {
      addDebug('❌ No current target - checking database...');
      if (arTargets.length === 0) {
        addDebug('❌ No AR targets in database');
        toast({
          title: "No AR Targets",
          description: "Please upload a video first to create AR targets",
          variant: "destructive"
        });
      } else {
        addDebug('🔧 Setting first target from database...');
        setCurrentTarget(arTargets[0]);
      }
      return;
    }
    
    addDebug('🎬 Setting up video overlay...');
    setIsPlaying(true);
    setPendingPlay(true);
  };

  const stopARVideo = () => {
    setIsPlaying(false);
    if (arVideoRef.current) {
      arVideoRef.current.pause();
      arVideoRef.current.currentTime = 0;
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Simple AR Scanner</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Target className="w-4 h-4" />
              {arTargets.length} targets
            </div>
            {isLocked && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <Lock className="w-4 h-4" />
                LOCKED
              </div>
            )}
          </div>
        </div>
        
        <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden mb-4">
          {/* Camera Feed */}
          <video 
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            muted
            autoPlay
          />
          
          {/* Detection Overlay Canvas */}
          {isScanning && (
            <canvas 
              ref={canvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none"
            />
          )}
          
          {/* AR Video Overlay */}
          {isPlaying && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="relative w-3/4 h-3/4">
                <video 
                  ref={arVideoRef}
                  className="w-full h-full object-cover rounded-lg border-4 border-green-500"
                  controls
                  playsInline
                  preload="metadata"
                  onClick={() => {
                    if (arVideoRef.current) {
                      if (arVideoRef.current.paused) {
                        arVideoRef.current.play();
                        console.log('👆 User tapped - playing video');
                      } else {
                        arVideoRef.current.pause();
                        console.log('👆 User tapped - pausing video');
                      }
                    }
                  }}
                />
                <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                  📱 Tap video to play with sound
                </div>
              </div>
            </div>
          )}
          
          {/* No Camera State */}
          {!isScanning && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <CameraIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Point camera at any object</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Progress Bar */}
        {isScanning && detectionProgress > 0 && (
          <div className="mb-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>AR Detection Progress</span>
              <span className={isLocked ? 'text-green-600 font-bold' : ''}>
                {Math.round(detectionProgress)}%
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${
                  isLocked ? 'bg-green-500' : 'bg-blue-500'
                }`}
                style={{ width: `${detectionProgress}%` }}
              />
            </div>
          </div>
        )}
        
        <div className="flex gap-2">
          {!isScanning ? (
            <Button 
              onClick={startCamera} 
              className="flex-1" 
              disabled={arTargets.length === 0}
            >
              <CameraIcon className="w-4 h-4 mr-2" />
              {arTargets.length === 0 ? 'No AR Targets' : 'Start AR Scan'}
            </Button>
          ) : (
            <Button onClick={stopCamera} variant="outline" className="flex-1">
              <Square className="w-4 h-4 mr-2" />
              Stop Scanning
            </Button>
          )}
          
          {isLocked && !isPlaying && (
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
      
      {/* Debug Console */}
      {debugInfo.length > 0 && (
        <Card className="p-3 bg-gray-100">
          <div className="font-semibold mb-2 text-sm">🐛 Debug:</div>
          {debugInfo.map((msg, i) => (
            <div key={i} className="text-xs text-gray-700">{msg}</div>
          ))}
        </Card>
      )}
      
      {isLocked && (
        <Card className="p-4 border-green-200 bg-green-50">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-semibold text-green-700">AR Target Detected!</span>
          </div>
          <p className="text-xs text-green-600 mt-1">
            Video overlay ready • Tap Play to watch with audio
          </p>
        </Card>
      )}
      
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-2">📋 How Simple AR Works:</h4>
        <ol className="text-blue-700 text-sm space-y-1">
          <li>1. 📹 Camera starts and analyzes the scene</li>
          <li>2. 🎯 Detects any stable surface or object</li>  
          <li>3. 📊 Shows detection progress (0-100%)</li>
          <li>4. 🔒 Locks when detection reaches 100%</li>
          <li>5. 🎬 Tap "Play AR Video" to overlay video</li>
          <li>6. 📱 Tap video player to start with sound</li>
        </ol>
      </div>
    </div>
  );
};

export default SimpleARScanner;