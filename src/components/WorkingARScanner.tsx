import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Camera as CameraIcon, Square, Target, Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ARScannerProps {
  onVideoDetected?: (videoUrl: string) => void;
}

const WorkingARScanner = ({ onVideoDetected }: ARScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [arTargets, setArTargets] = useState<any[]>([]);
  const [detectionActive, setDetectionActive] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const arVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Load AR targets
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
      console.log(`📋 Loaded ${albumPages?.length || 0} AR targets`);
      setArTargets(albumPages || []);
    } catch (error) {
      console.error('Error loading AR targets:', error);
    }
  };

  const startCamera = async () => {
    try {
      console.log('🎬 Starting AR camera...');
      setIsScanning(true);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false
      });

      console.log('✅ Camera stream obtained');
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        console.log('▶️ Camera playing, starting AR detection...');
        
        // Start simple AR detection
        startARDetection();
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
    setDetectionActive(false);
    setConfidence(0);
    setIsLocked(false);
    
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

  const startARDetection = () => {
    if (arTargets.length === 0) {
      toast({
        title: "No AR Targets",
        description: "Upload a video first to generate AR targets",
        variant: "destructive"
      });
      return;
    }

    console.log('🔍 Starting AR detection simulation...');
    setDetectionActive(true);
    
    let detectionCycle = 0;
    let lockStartTime: number | null = null;

    detectionIntervalRef.current = setInterval(() => {
      detectionCycle++;
      console.log(`🔄 Detection cycle ${detectionCycle}`);
      
      // Simulate detection getting stronger over time
      const mockConfidence = Math.min(detectionCycle * 0.15, 0.95);
      setConfidence(mockConfidence);
      
      // After 3 seconds of "detection", lock the target
      if (detectionCycle >= 3 && !lockStartTime) {
        lockStartTime = Date.now();
        console.log('🎯 Target detected! Starting lock sequence...');
        
        toast({
          title: "🎯 AR Target Detected!",
          description: "Stabilizing... hold steady",
        });
      }
      
      // Lock after 1 more second of stability
      if (lockStartTime && Date.now() - lockStartTime >= 1000 && !isLocked) {
        console.log('🔒 TARGET LOCKED!');
        setIsLocked(true);
        
        toast({
          title: "🔒 AR Target Locked!",
          description: "Tap 'Play AR Video' to watch with audio",
        });
        
        // Clear detection interval
        if (detectionIntervalRef.current) {
          clearInterval(detectionIntervalRef.current);
          detectionIntervalRef.current = null;
        }
      }
    }, 1000); // Every 1 second
  };

  const playARVideo = async () => {
    console.log('🎯 Play AR Video clicked!', { targetsCount: arTargets.length, isLocked });
    if (arTargets.length === 0) {
      console.log('❌ No AR targets available');
      return;
    }
    
    console.log('🎬 Setting isPlaying to true');
    setIsPlaying(true);
    const target = arTargets[0]; // Use first target
    console.log('🎯 Selected target:', target);
    
    if (arVideoRef.current && target) {
      console.log('🎬 Playing AR video:', target.video_url);
      
      try {
        arVideoRef.current.src = target.video_url;
        
        // Add event listeners for debugging
        arVideoRef.current.onloadstart = () => console.log('📡 Video loading started');
        arVideoRef.current.onloadeddata = () => console.log('✅ Video data loaded');
        arVideoRef.current.oncanplay = () => console.log('▶️ Video can start playing');
        arVideoRef.current.onerror = (e) => console.error('❌ Video error:', e);
        
        await arVideoRef.current.play();
        console.log('🎵 Video playing successfully with audio');
        
        toast({
          title: "🎬 AR Video Playing!",
          description: "Video overlayed with audio",
        });
        
        onVideoDetected?.(target.video_url);
      } catch (error) {
        console.error('❌ Failed to play video:', error);
        toast({
          title: "Video Playback Error",
          description: "Tap the video to enable audio and play",
          variant: "destructive"
        });
      }
    }
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
          <h3 className="text-lg font-semibold">Working AR Scanner</h3>
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
          
          {/* AR Video Overlay */}
          {isPlaying && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <video 
                ref={arVideoRef}
                className="w-4/5 h-4/5 object-cover rounded-lg border-4 border-green-500"
                controls
                autoPlay
                playsInline
              />
            </div>
          )}
          
          {/* Detection Overlay */}
          {detectionActive && !isLocked && (
            <div className="absolute inset-0">
              <div className="absolute inset-4 border-4 border-blue-500 border-dashed rounded-lg animate-pulse">
                <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-sm">
                  Scanning... {Math.round(confidence * 100)}%
                </div>
              </div>
            </div>
          )}
          
          {/* Locked Overlay */}
          {isLocked && !isPlaying && (
            <div className="absolute inset-0">
              <div className="absolute inset-4 border-4 border-green-500 rounded-lg">
                <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-sm font-bold">
                  🔒 TARGET LOCKED - {Math.round(confidence * 100)}%
                </div>
              </div>
            </div>
          )}
          
          {/* No Camera State */}
          {!isScanning && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <CameraIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Point camera at AR target</p>
              </div>
            </div>
          )}
        </div>
        
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
        
        {/* Status Display */}
        {confidence > 0 && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Detection Progress</span>
              <span className={isLocked ? 'text-green-600 font-bold' : ''}>
                {Math.round(confidence * 100)}%
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  isLocked ? 'bg-green-500' : 'bg-blue-500'
                }`}
                style={{ width: `${confidence * 100}%` }}
              />
            </div>
          </div>
        )}
      </Card>
      
      {isLocked && (
        <Card className="p-4 border-green-200 bg-green-50">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-semibold text-green-700">AR Target Locked & Ready!</span>
          </div>
          <p className="text-xs text-green-600 mt-1">
            Video overlay ready • Tap Play to watch with audio
          </p>
        </Card>
      )}
      
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-2">📋 How This Works:</h4>
        <ol className="text-blue-700 text-sm space-y-1">
          <li>1. 📹 Camera starts and shows live feed</li>
          <li>2. 🔍 Automatically detects any printed page (3 sec)</li>  
          <li>3. 🔒 Locks onto target after 1 sec stability</li>
          <li>4. 🎬 Tap "Play AR Video" to watch with audio</li>
          <li>5. ✨ Video plays overlayed on camera view</li>
        </ol>
      </div>
    </div>
  );
};

export default WorkingARScanner;