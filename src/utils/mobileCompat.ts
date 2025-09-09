// Mobile compatibility utilities for Capacitor apps

export const isBrowser = () => {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
};

export const isCapacitor = () => {
  return isBrowser() && !!(window as any).Capacitor;
};

// Safe wrapper for navigator APIs
export const safeNavigator = {
  mediaDevices: {
    getUserMedia: async (constraints: MediaStreamConstraints): Promise<MediaStream> => {
      if (!isBrowser() || !navigator?.mediaDevices?.getUserMedia) {
        throw new Error('getUserMedia not available');
      }
      return navigator.mediaDevices.getUserMedia(constraints);
    }
  },
  vibrate: (pattern?: VibratePattern) => {
    if (isBrowser() && navigator.vibrate) {
      return navigator.vibrate(pattern || 200);
    }
    return false;
  }
};

// Safe wrapper for DOM APIs
export const safeDocument = {
  createElement: (tagName: string) => {
    if (!isBrowser()) {
      throw new Error('Document not available');
    }
    return document.createElement(tagName);
  },
  querySelector: (selector: string) => {
    if (!isBrowser()) {
      return null;
    }
    return document.querySelector(selector);
  },
  getElementById: (id: string) => {
    if (!isBrowser()) {
      return null;
    }
    return document.getElementById(id);
  }
};

// Safe wrapper for window APIs
export const safeWindow = {
  open: (url?: string, target?: string, features?: string) => {
    if (!isBrowser()) {
      return null;
    }
    return window.open(url, target, features);
  },
  addEventListener: (type: string, listener: EventListener, options?: AddEventListenerOptions) => {
    if (isBrowser()) {
      window.addEventListener(type, listener, options);
    }
  },
  removeEventListener: (type: string, listener: EventListener, options?: EventListenerOptions) => {
    if (isBrowser()) {
      window.removeEventListener(type, listener, options);
    }
  }
};