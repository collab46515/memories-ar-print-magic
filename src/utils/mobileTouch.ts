// Mobile touch optimization utilities
export class MobileTouchHandler {
  private touchStartTime: number = 0;
  private touchStartPos: { x: number; y: number } = { x: 0, y: 0 };
  private readonly TAP_THRESHOLD = 300; // ms
  private readonly MOVE_THRESHOLD = 10; // pixels

  constructor(private element: HTMLElement) {
    this.setupTouchHandlers();
  }

  private setupTouchHandlers() {
    // Optimize element for touch
    this.element.style.touchAction = 'manipulation';
    (this.element.style as any).webkitTouchCallout = 'none';
    (this.element.style as any).webkitUserSelect = 'none';
    this.element.style.userSelect = 'none';
    
    // Prevent unwanted behaviors
    this.element.addEventListener('contextmenu', this.preventContext);
    this.element.addEventListener('touchstart', this.handleTouchStart, { passive: false });
    this.element.addEventListener('touchend', this.handleTouchEnd, { passive: false });
    this.element.addEventListener('touchmove', this.handleTouchMove, { passive: false });
  }

  private preventContext = (e: Event) => {
    e.preventDefault();
    return false;
  };

  private handleTouchStart = (e: TouchEvent) => {
    this.touchStartTime = Date.now();
    const touch = e.touches[0];
    this.touchStartPos = { x: touch.clientX, y: touch.clientY };
  };

  private handleTouchMove = (e: TouchEvent) => {
    // Prevent scrolling during AR interactions
    e.preventDefault();
  };

  private handleTouchEnd = (e: TouchEvent) => {
    const touchEndTime = Date.now();
    const touchDuration = touchEndTime - this.touchStartTime;
    
    if (touchDuration < this.TAP_THRESHOLD) {
      const touch = e.changedTouches[0];
      const moveDistance = Math.sqrt(
        Math.pow(touch.clientX - this.touchStartPos.x, 2) +
        Math.pow(touch.clientY - this.touchStartPos.y, 2)
      );
      
      if (moveDistance < this.MOVE_THRESHOLD) {
        // Valid tap detected
        this.onTap?.(touch.clientX, touch.clientY);
      }
    }
  };

  public onTap?: (x: number, y: number) => void;

  public destroy() {
    this.element.removeEventListener('contextmenu', this.preventContext);
    this.element.removeEventListener('touchstart', this.handleTouchStart);
    this.element.removeEventListener('touchend', this.handleTouchEnd);
    this.element.removeEventListener('touchmove', this.handleTouchMove);
  }
}

// Haptic feedback for mobile
export const hapticFeedback = (type: 'light' | 'medium' | 'heavy' = 'light') => {
  if ('vibrate' in navigator) {
    const vibrationPattern = {
      light: [10],
      medium: [20],
      heavy: [30]
    };
    navigator.vibrate(vibrationPattern[type]);
  }
};

// Wake lock to prevent screen from turning off during AR
export const requestWakeLock = async () => {
  if ('wakeLock' in navigator) {
    try {
      const wakeLock = await (navigator as any).wakeLock.request('screen');
      console.log('🔋 Screen wake lock acquired');
      return wakeLock;
    } catch (err) {
      console.log('❌ Wake lock failed:', err);
    }
  }
  return null;
};

// Performance optimization for mobile browsers
export const optimizeForMobile = () => {
  // Disable text selection globally during AR
  (document.body.style as any).webkitUserSelect = 'none';
  document.body.style.userSelect = 'none';
  
  // Prevent pull-to-refresh
  document.body.style.overscrollBehavior = 'none';
  
  // Optimize scrolling
  (document.documentElement.style as any).webkitOverflowScrolling = 'touch';
  
  // Hardware acceleration
  document.body.style.transform = 'translateZ(0)';
};

// Mobile viewport optimization
export const optimizeViewport = () => {
  let viewport = document.querySelector('meta[name=viewport]') as HTMLMetaElement;
  
  if (!viewport) {
    viewport = document.createElement('meta');
    viewport.name = 'viewport';
    document.head.appendChild(viewport);
  }
  
  viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
};