import { useEffect, useRef, useState } from 'react';

interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  isLowPerformance: boolean;
}

export const useMobileOptimization = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memoryUsage: 0,
    isLowPerformance: false
  });
  
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const monitoringRef = useRef<number | null>(null);

  // Performance monitoring
  useEffect(() => {
    const startMonitoring = () => {
      const checkPerformance = () => {
        const now = performance.now();
        frameCountRef.current++;
        
        // Calculate FPS every second
        if (now - lastTimeRef.current >= 1000) {
          const fps = Math.round((frameCountRef.current * 1000) / (now - lastTimeRef.current));
          
          // Get memory info if available
          const memory = (performance as any).memory;
          const memoryUsage = memory ? Math.round(memory.usedJSHeapSize / 1048576) : 0;
          
          // Determine if performance is low
          const isLowPerformance = fps < 20 || memoryUsage > 100;
          
          setMetrics({ fps, memoryUsage, isLowPerformance });
          
          frameCountRef.current = 0;
          lastTimeRef.current = now;
        }
        
        monitoringRef.current = requestAnimationFrame(checkPerformance);
      };
      
      monitoringRef.current = requestAnimationFrame(checkPerformance);
    };

    startMonitoring();
    
    return () => {
      if (monitoringRef.current) {
        cancelAnimationFrame(monitoringRef.current);
      }
    };
  }, []);

  // Mobile-specific optimizations
  const getMobileConstraints = () => ({
    video: {
      facingMode: 'environment',
      width: { ideal: 640, max: 1280 },
      height: { ideal: 480, max: 720 },
      frameRate: { ideal: 24, max: 30 }
    },
    audio: false
  });

  // Touch event optimization
  const optimizeTouchEvents = (element: HTMLElement) => {
    // Prevent default touch behaviors that can interfere
    element.style.touchAction = 'manipulation';
    (element.style as any).webkitTouchCallout = 'none';
    (element.style as any).webkitUserSelect = 'none';
    
    // Add hardware acceleration
    element.style.transform = 'translateZ(0)';
    element.style.willChange = 'transform';
  };

  // Video element optimization
  const optimizeVideoElement = (video: HTMLVideoElement) => {
    video.setAttribute('webkit-playsinline', 'true');
    video.setAttribute('playsinline', 'true');
    video.preload = 'none';
    
    // Hardware acceleration
    video.style.transform = 'translateZ(0)';
    video.style.willChange = 'transform';
    
    // Prevent context menu on long press
    video.addEventListener('contextmenu', (e) => e.preventDefault());
    
    return video;
  };

  // Canvas optimization
  const optimizeCanvas = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Optimize canvas rendering
      ctx.imageSmoothingEnabled = false;
      ctx.globalCompositeOperation = 'source-over';
      
      // Hardware acceleration
      canvas.style.transform = 'translateZ(0)';
      canvas.style.willChange = 'transform';
    }
    return ctx;
  };

  // Memory cleanup
  const cleanupResources = (
    stream?: MediaStream | null,
    intervals?: (NodeJS.Timeout | null)[]
  ) => {
    // Stop media streams
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    
    // Clear intervals
    intervals?.forEach(interval => {
      if (interval) clearInterval(interval);
    });
    
    // Force garbage collection if available
    if ('gc' in window) {
      (window as any).gc();
    }
  };

  return {
    metrics,
    getMobileConstraints,
    optimizeTouchEvents,
    optimizeVideoElement,
    optimizeCanvas,
    cleanupResources
  };
};