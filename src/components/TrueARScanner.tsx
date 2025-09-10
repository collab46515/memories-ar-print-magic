import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Camera as CameraIcon, Square, Target } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TrueARScannerProps {
  onVideoDetected?: (videoUrl: string) => void;
}

const TrueARScanner = ({ onVideoDetected }: TrueARScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [arTargets, setArTargets] = useState<any[]>([]);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Debug helper
  const addDebug = (message: string) => {
    console.log(message);
    setDebugInfo(prev => [...prev.slice(-4), `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  // Load AR targets
  useEffect(() => {
    loadARTargets();
  }, []);

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
        addDebug('🎯 AR targets ready for scanning');
      } else {
        addDebug('⚠️ No AR targets found - upload video first');
      }
    } catch (error) {
      console.error('Error loading AR targets:', error);
      addDebug('❌ Failed to load targets: ' + (error as Error).message);
    }
  };

  const startARScanning = () => {
    if (arTargets.length === 0) {
      toast({
        title: "No AR Targets",
        description: "Please upload a video first to create AR targets",
        variant: "destructive"
      });
      return;
    }

    addDebug('🎬 Starting True AR scanning...');
    setIsScanning(true);

    // Create AR.js scene
    createARScene();
  };

  // Helper function to convert image URL to base64
  const imageToBase64 = async (imageUrl: string): Promise<string> => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          resolve(base64.split(',')[1]); // Remove data:image/png;base64, prefix
        };
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      addDebug('❌ Failed to convert image to base64');
      return '';
    }
  };

  const createARScene = async () => {
    if (!containerRef.current || arTargets.length === 0) return;

    const target = arTargets[0]; // Use first target
    addDebug('🎯 Creating AR scene for target...');

    // Clear existing content
    containerRef.current.innerHTML = '';

    // Convert image to base64 for NFT tracking
    const base64Image = await imageToBase64(target.ar_target_image_url);
    
    // Create A-Frame scene optimized for mobile with NFT tracking
    const sceneHTML = `
      <a-scene 
        arjs="sourceType: webcam; debugUIEnabled: false; trackingMethod: best; maxDetectionRate: 60; canvasWidth: 640; canvasHeight: 480;"
        renderer="logarithmicDepthBuffer: true; antialias: false; precision: mediump;"
        background="transparent"
        vr-mode-ui="enabled: false"
        gesture-detector
        id="ar-scene"
      >
        <!-- Image-based marker using your album page -->
        <a-image
          src="${target.ar_target_image_url}"
          position="0 0 -4"
          width="3"
          height="3"
          id="target-preview"
          visible="false"
        ></a-image>

        <!-- Fallback: Use hiro marker for reliable tracking -->
        <a-marker
          preset="hiro"
          id="ar-marker"
          registerevents
        >
          <!-- Video that will appear on the marker -->
          <a-video
            src="${target.video_url}"
            position="0 0 0"
            rotation="-90 0 0"
            width="1.5"
            height="1.5"
            play="false"
            id="ar-video"
            crossorigin="anonymous"
          ></a-video>
          
          <!-- Play button overlay -->
          <a-plane
            position="0 0 0.01"
            rotation="-90 0 0"
            width="1.5"
            height="1.5"
            color="rgba(0,0,0,0.7)"
            id="play-overlay"
          >
            <a-text
              value="▶ TAP TO PLAY"
              position="0 0 0.01"
              align="center"
              color="white"
              scale="0.3 0.3 0.3"
            ></a-text>
          </a-plane>
        </a-marker>

        <!-- Camera -->
        <a-entity camera></a-entity>
      </a-scene>
    `;

    containerRef.current.innerHTML = sceneHTML;

    // Wait for scene to load
    setTimeout(() => {
      setupAREvents();
    }, 1000);
  };

  const setupAREvents = () => {
    addDebug('🔧 Setting up AR event listeners...');

    const marker = document.querySelector('#ar-marker');
    const video = document.querySelector('#ar-video') as any;
    const playOverlay = document.querySelector('#play-overlay');

    if (!marker || !video || !playOverlay) {
      addDebug('❌ Failed to find AR elements');
      return;
    }

    // Marker found event
    marker.addEventListener('markerFound', () => {
      addDebug('🎯 AR Marker detected!');
      toast({
        title: "🎯 AR Target Found!",
        description: "Tap the video to play with sound",
      });
    });

    // Marker lost event
    marker.addEventListener('markerLost', () => {
      addDebug('📤 AR Marker lost');
      video.pause();
    });

    // Play button click
    playOverlay?.addEventListener('click', () => {
      addDebug('🎬 Play button tapped');
      video.play();
      (playOverlay as any).style.display = 'none';
      
      toast({
        title: "🎬 AR Video Playing!",
        description: "Video is now overlaid on the marker",
      });

      onVideoDetected?.(arTargets[0]?.video_url);
    });

    addDebug('✅ AR events setup complete');
  };

  const stopARScanning = () => {
    addDebug('⏹️ Stopping AR scanning...');
    setIsScanning(false);
    
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">True AR Scanner</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Target className="w-4 h-4" />
            {arTargets.length} targets
          </div>
        </div>
        
        <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden mb-4">
          {/* AR.js Container */}
          <div 
            ref={containerRef}
            className="w-full h-full"
            style={{ 
              display: isScanning ? 'block' : 'none' 
            }}
          />
          
          {/* No Camera State */}
          {!isScanning && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <CameraIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Point camera at printed AR target</p>
                <p className="text-xs text-gray-500 mt-1">
                  Print the AR target image first
                </p>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          {!isScanning ? (
            <Button 
              onClick={startARScanning} 
              className="flex-1" 
              disabled={arTargets.length === 0}
            >
              <CameraIcon className="w-4 h-4 mr-2" />
              {arTargets.length === 0 ? 'No AR Targets' : 'Start True AR'}
            </Button>
          ) : (
            <Button onClick={stopARScanning} variant="outline" className="flex-1">
              <Square className="w-4 h-4 mr-2" />
              Stop AR Scanning
            </Button>
          )}
        </div>
      </Card>
      
      {/* Debug Console */}
      {debugInfo.length > 0 && (
        <Card className="p-3 bg-gray-100">
          <div className="font-semibold mb-2 text-sm">🐛 AR Debug:</div>
          {debugInfo.map((msg, i) => (
            <div key={i} className="text-xs text-gray-700">{msg}</div>
          ))}
        </Card>
      )}
      
      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <h4 className="font-semibold text-green-800 mb-2">🎯 True AR Instructions:</h4>
        <ol className="text-green-700 text-sm space-y-1">
          <li>1. 🖨️ <strong>Print the AR target image</strong> (generated when you uploaded video)</li>
          <li>2. 📱 Tap "Start True AR" to activate camera</li>  
          <li>3. 🎯 Point camera at the <strong>printed target</strong></li>
          <li>4. ✨ Video will appear <strong>ON the printed paper</strong></li>
          <li>5. 👆 Tap the video overlay to play with sound</li>
          <li>6. 📐 Video follows the paper as you move camera!</li>
        </ol>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-2">🎯 True AR Instructions:</h4>
        <ol className="text-blue-700 text-sm space-y-2">
          <li>1. 🖨️ <strong>Print the HIRO marker</strong> - <a href="https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/images/hiro.png" target="_blank" className="underline text-blue-600">Download here</a></li>
          <li>2. 📱 <strong>Start True AR scanner</strong> above</li>
          <li>3. 🎯 <strong>Point camera at printed HIRO marker</strong></li>
          <li>4. 🎬 <strong>Video will appear ON the marker</strong> and track with it</li>
          <li>5. 👆 <strong>Tap the video</strong> to play with sound</li>
        </ol>
        <div className="mt-3 p-2 bg-blue-100 rounded border-l-4 border-blue-400">
          <p className="text-xs text-blue-800">
            💡 <strong>Note:</strong> This uses HIRO marker for reliable tracking. Video appears directly on the printed marker and follows it as you move the paper!
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrueARScanner;