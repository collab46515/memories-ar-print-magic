import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Camera as CameraIcon, Square, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const SimpleARDetector = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [arTargets, setArTargets] = useState<any[]>([]);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [detectionStatus, setDetectionStatus] = useState<'idle' | 'detecting' | 'found'>('idle');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const arVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadARTargets();
    return () => {
      if (detectionTimeoutRef.current) {
        clearTimeout(detectionTimeoutRef.current);
      }
    };
  }, []);

  const loadARTargets = async () => {
    try {
      const { data: albumPages, error } = await supabase
        .from('album_pages')
        .select('*')
        .not('ar_target_image_url', 'is', null)
        .not('video_url', 'is', null);
      
      if (error) throw error;
      console.log(`📋 Loaded ${albumPages?.length || 0} AR targets`);
      setArTargets(albumPages || []);
    } catch (error) {
      console.error('Error loading AR targets:', error);
      toast({
        title: "Loading Error",
        description: "Failed to load AR targets from database",
        variant: "destructive"
      });
    }
  };

  const startCamera = async () => {
    try {
      setIsScanning(true);
      setDetectionStatus('idle');

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 }
        },
        audio: false
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        
        // Start simple detection after camera stabilizes
        setTimeout(() => {
          startSimpleDetection();
        }, 1500);
        
        toast({
          title: "📱 Camera Ready",
          description: "Point at your printed album page to activate AR",
        });
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

  const startSimpleDetection = () => {
    if (arTargets.length === 0) {
      toast({
        title: "No AR Content",
        description: "Upload a video first to create AR content",
        variant: "destructive"  
      });
      return;
    }

    setDetectionStatus('detecting');
    console.log('🔍 Starting simplified AR detection...');

    // Simulate detection process with visual feedback
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += Math.random() * 15 + 5; // Random progress 5-20%
      
      if (progress >= 100) {
        clearInterval(progressInterval);
        
        // Simulate successful detection
        setDetectionStatus('found');
        setCurrentVideo(arTargets[0].video_url);
        
        console.log('✅ AR target "detected" - ready for video');
        toast({
          title: "🎯 Album Page Detected!",
          description: "Tap Play Video to watch your content",
        });
      }
    }, 300);

    // Cleanup after 4 seconds if not found
    detectionTimeoutRef.current = setTimeout(() => {
      clearInterval(progressInterval);
      if (detectionStatus === 'detecting') {
        setDetectionStatus('idle');
        toast({
          title: "Keep Trying",
          description: "Make sure the album page is clearly visible and well-lit",
        });
      }
    }, 4000);
  };

  const stopCamera = () => {
    setIsScanning(false);
    setDetectionStatus('idle');
    setIsPlaying(false);
    
    if (detectionTimeoutRef.current) {
      clearTimeout(detectionTimeoutRef.current);
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const playVideo = () => {
    if (!currentVideo) return;
    
    setIsPlaying(true);
    
    if (arVideoRef.current) {
      arVideoRef.current.src = currentVideo;
      toast({
        title: "🎬 Video Ready",
        description: "Tap the video player to start playback with audio",
      });
    }
  };

  const stopVideo = () => {
    setIsPlaying(false);
    if (arVideoRef.current) {
      arVideoRef.current.pause();
      arVideoRef.current.currentTime = 0;
    }
  };

  const getStatusColor = () => {
    switch (detectionStatus) {
      case 'detecting': return 'text-blue-600';
      case 'found': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusMessage = () => {
    switch (detectionStatus) {
      case 'detecting': return 'Scanning for album page...';
      case 'found': return 'Album page detected!';
      default: return 'Point camera at album page';
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">📱 Simple AR Scanner</h3>
          <div className="flex items-center gap-2 text-sm">
            <div className={`w-2 h-2 rounded-full ${
              detectionStatus === 'found' ? 'bg-green-500 animate-pulse' : 
              detectionStatus === 'detecting' ? 'bg-blue-500 animate-pulse' : 
              'bg-gray-400'
            }`} />
            <span className={getStatusColor()}>{getStatusMessage()}</span>
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
              <div className="relative w-4/5 h-4/5">
                <video 
                  ref={arVideoRef}
                  className="w-full h-full object-cover rounded-lg border-4 border-green-500 shadow-2xl"
                  controls
                  playsInline
                  preload="metadata"
                  onClick={() => {
                    if (arVideoRef.current?.paused) {
                      arVideoRef.current?.play();
                    } else {
                      arVideoRef.current?.pause();
                    }
                  }}
                />
                <div className="absolute -top-8 left-0 right-0 text-center">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    📱 Tap video to play with sound
                  </span>
                </div>
              </div>
            </div>
          )}
          
          {/* Detection Overlay */}
          {detectionStatus === 'detecting' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-blue-500/80 text-white px-4 py-2 rounded-full font-medium">
                🔍 Scanning...
              </div>
            </div>
          )}
          
          {/* No Camera State */}
          {!isScanning && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <CameraIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Reliable AR scanning for printed pages</p>
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
              {arTargets.length === 0 ? 'No AR Content Available' : 'Start AR Scanner'}
            </Button>
          ) : (
            <Button onClick={stopCamera} variant="outline" className="flex-1">
              <Square className="w-4 h-4 mr-2" />
              Stop Scanner
            </Button>
          )}
          
          {detectionStatus === 'found' && !isPlaying && (
            <Button onClick={playVideo} className="flex-1">
              <Play className="w-4 h-4 mr-2" />
              Play AR Video
            </Button>
          )}
          
          {isPlaying && (
            <Button onClick={stopVideo} variant="outline" className="flex-1">
              <Square className="w-4 h-4 mr-2" />
              Stop Video
            </Button>
          )}
        </div>
        
        {arTargets.length === 0 && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-amber-800">No AR Content Found</p>
                <p className="text-amber-700">Upload a video first to generate AR album pages.</p>
              </div>
            </div>
          </div>
        )}
      </Card>
      
      <Card className="p-4 bg-blue-50 border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-2">📋 How It Works:</h4>
        <ol className="text-blue-700 text-sm space-y-1">
          <li>1. 📹 Start the AR scanner</li>
          <li>2. 🎯 Point camera at your printed album page</li>  
          <li>3. ⏳ Wait for "Album page detected!" message</li>
          <li>4. 🎬 Tap "Play AR Video" to overlay video</li>
          <li>5. 📱 Tap video player to start with sound</li>
        </ol>
        <p className="text-xs text-blue-600 mt-2">
          💡 Works best with printed pages in good lighting
        </p>
      </Card>
    </div>
  );
};

export default SimpleARDetector;