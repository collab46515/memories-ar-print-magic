import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera as CameraIcon, Square, Target, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface NFTARScannerProps {
  onVideoDetected?: (videoUrl: string) => void;
}

const NFTARScanner = ({ onVideoDetected }: NFTARScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [arTargets, setArTargets] = useState<any[]>([]);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [markerFilesExist, setMarkerFilesExist] = useState(false);
  
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
    checkMarkerFiles();
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
        addDebug('🎯 AR targets ready for NFT scanning');
      } else {
        addDebug('⚠️ No AR targets found - upload video first');
      }
    } catch (error) {
      console.error('Error loading AR targets:', error);
      addDebug('❌ Failed to load targets: ' + (error as Error).message);
    }
  };

  const checkMarkerFiles = async () => {
    try {
      // More strict check - verify actual file content exists
      const response = await fetch('/markers/page1/page1.fset', { method: 'HEAD' });
      const exists = response.ok && response.status === 200 && response.headers.get('content-length') !== '0';
      setMarkerFilesExist(exists);
      if (exists) {
        addDebug('✅ NFT marker files found and verified');
      } else {
        addDebug('⚠️ NFT marker files missing - need to generate them first');
      }
    } catch (error) {
      setMarkerFilesExist(false);
      addDebug('⚠️ NFT marker files not accessible - will show create button');
    }
  };

  const startNFTScanning = () => {
    if (arTargets.length === 0) {
      toast({
        title: "No AR Targets",
        description: "Please upload a video first to create AR targets",
        variant: "destructive"
      });
      return;
    }

    if (!markerFilesExist) {
      toast({
        title: "NFT Markers Required",
        description: "Generate NFT marker files first using AR.js NFT Creator",
        variant: "destructive"
      });
      return;
    }

    addDebug('🎬 Starting NFT AR scanning...');
    setIsScanning(true);
    createNFTScene();
  };

  const createNFTScene = () => {
    if (!containerRef.current || arTargets.length === 0) return;

    const target = arTargets[0]; // Use first target
    addDebug('🎯 Creating NFT AR scene...');

    // Clear existing content
    containerRef.current.innerHTML = '';

    // Create the NFT AR scene
    const sceneHTML = `
      <a-scene
        embedded
        vr-mode-ui="enabled: false"
        renderer="colorManagement: true, physicallyCorrectLights: true"
        arjs="trackingMethod: best; sourceType: webcam; debugUIEnabled: false; patternRatio: 0.90;"
        style="height: 100%; width: 100%;"
      >
        <!-- Assets -->
        <a-assets>
          <video 
            id="nft-vid" 
            src="${target.video_url}" 
            autoplay 
            loop 
            muted 
            playsinline 
            webkit-playsinline
            crossorigin="anonymous">
          </video>
        </a-assets>

        <!-- NFT Marker - uses the generated marker files -->
        <a-nft
          type="nft"
          url="/markers/page1/page1"
          smooth="true" 
          smoothCount="5" 
          smoothTolerance="0.01" 
          smoothThreshold="5"
          emitevents="true"
          id="nft-marker"
        >
          <!-- Video plane sized to match page aspect ratio -->
          <a-video
            src="#nft-vid"
            width="1"
            height="1.414"
            position="0 0 0"
            rotation="-90 0 0"
            id="nft-video"
          ></a-video>
        </a-nft>

        <a-entity camera></a-entity>
      </a-scene>

      <!-- Unmute button -->
      <button id="unmute-btn" class="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-lg font-semibold shadow-lg">
        🔊 Tap for Sound
      </button>
    `;

    containerRef.current.innerHTML = sceneHTML;

    // Wait for scene to load
    setTimeout(() => {
      setupNFTEvents();
    }, 2000);
  };

  const setupNFTEvents = () => {
    addDebug('🔧 Setting up NFT event listeners...');

    const scene = containerRef.current?.querySelector('a-scene');
    const video = containerRef.current?.querySelector('#nft-vid') as HTMLVideoElement;
    const unmuteBtn = containerRef.current?.querySelector('#unmute-btn') as HTMLButtonElement;

    if (!scene || !video || !unmuteBtn) {
      addDebug('❌ Failed to find NFT elements');
      return;
    }

    // Marker found event
    scene.addEventListener('markerFound', () => {
      addDebug('🎯 NFT Marker detected!');
      toast({
        title: "🎯 NFT Target Found!",
        description: "Video is now tracking the page image",
      });
    });

    // Marker lost event
    scene.addEventListener('markerLost', () => {
      addDebug('📤 NFT Marker lost');
    });

    // Unmute functionality
    const tryUnmute = () => {
      video.muted = false;
      video.play()
        .then(() => {
          unmuteBtn.style.display = 'none';
          addDebug('🎵 Video unmuted and playing');
          toast({
            title: "🎵 Audio Enabled!",
            description: "Video is now playing with sound",
          });
        })
        .catch(() => {
          addDebug('⚠️ Could not unmute - user gesture required');
        });
      
      onVideoDetected?.(arTargets[0]?.video_url);
    };

    unmuteBtn.addEventListener('click', tryUnmute);
    
    // Also try to unmute on any touch (mobile requirement)
    window.addEventListener('touchend', tryUnmute, { once: true });

    addDebug('✅ NFT events setup complete');
  };

  const stopNFTScanning = () => {
    addDebug('⏹️ Stopping NFT scanning...');
    setIsScanning(false);
    
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }
  };

  const openNFTCreator = () => {
    window.open('https://carnaux.github.io/NFT-Marker-Creator/', '_blank');
  };

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">NFT AR Scanner</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Target className="w-4 h-4" />
            {arTargets.length} targets
            {markerFilesExist ? (
              <span className="text-green-600">• NFT Ready</span>
            ) : (
              <span className="text-amber-600">• NFT Pending</span>
            )}
          </div>
        </div>
        
        <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden mb-4">
          {/* NFT AR Container */}
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
                <p className="text-sm text-gray-600">Point camera at printed album page</p>
                <p className="text-xs text-gray-500 mt-1">
                  {markerFilesExist ? 'NFT markers ready' : 'Generate NFT markers first'}
                </p>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          {!isScanning ? (
            <Button 
              onClick={startNFTScanning} 
              className="flex-1" 
              disabled={arTargets.length === 0 || !markerFilesExist}
            >
              <CameraIcon className="w-4 h-4 mr-2" />
              {arTargets.length === 0 
                ? 'No AR Targets' 
                : !markerFilesExist 
                  ? 'Generate NFT Markers First'
                  : 'Start NFT AR'
              }
            </Button>
          ) : (
            <Button onClick={stopNFTScanning} variant="outline" className="flex-1">
              <Square className="w-4 h-4 mr-2" />
              Stop NFT Scanning
            </Button>
          )}
          
          <Button onClick={openNFTCreator} variant="outline">
            <ExternalLink className="w-4 h-4 mr-2" />
            Create NFT Markers
          </Button>
        </div>
      </Card>
      
      {/* Debug Console */}
      {debugInfo.length > 0 && (
        <Card className="p-3 bg-gray-100">
          <div className="font-semibold mb-2 text-sm">🐛 NFT Debug:</div>
          {debugInfo.map((msg, i) => (
            <div key={i} className="text-xs text-gray-700">{msg}</div>
          ))}
        </Card>
      )}
      
      {/* NFT Setup Instructions */}
      {!markerFilesExist && (
        <Card className="p-4 border-amber-200 bg-amber-50">
          <h4 className="font-semibold text-amber-800 mb-2">⚙️ NFT Marker Setup Required:</h4>
          <ol className="text-amber-700 text-sm space-y-1 mb-3">
            <li>1. 🖼️ <strong>Save your album page image</strong> (the exact one you'll print)</li>
            <li>2. 🔗 <strong>Open NFT Marker Creator</strong> (click button above)</li>
            <li>3. 📤 <strong>Upload your page image</strong> to the creator</li>
            <li>4. 📥 <strong>Download the 4 marker files</strong> (.fset, .fset3, .iset, .flev)</li>
            <li>5. 📁 <strong>Place files in:</strong> public/markers/page1/</li>
            <li>6. 🔄 <strong>Refresh this page</strong> to detect the files</li>
          </ol>
          <p className="text-xs text-amber-600">
            💡 NFT tracking works with the actual image features (no artificial markers needed)
          </p>
        </Card>
      )}

      {markerFilesExist && (
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h4 className="font-semibold text-green-800 mb-2">🎯 NFT AR Instructions:</h4>
          <ol className="text-green-700 text-sm space-y-1">
            <li>1. 🖨️ <strong>Print the album page</strong> at 100% scale (matte finish preferred)</li>
            <li>2. 📱 Tap "Start NFT AR" to activate camera</li>  
            <li>3. 🎯 Point camera at the <strong>printed page</strong></li>
            <li>4. 📏 Fill ~70% of camera view, avoid glare</li>
            <li>5. ✨ Video appears <strong>tracked to the page</strong> (~1-2 seconds)</li>
            <li>6. 🔊 Tap "Tap for Sound" to unmute audio</li>
          </ol>
        </div>
      )}
    </div>
  );
};

export default NFTARScanner;