import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    // Check if window APIs are available (Capacitor compatibility)
    if (typeof window === 'undefined') {
      setIsMobile(false);
      return;
    }

    const checkMobile = () => {
      const width = window.innerWidth || 0;
      setIsMobile(width < MOBILE_BREAKPOINT);
    };

    // Initial check
    checkMobile();

    // Set up listener if matchMedia is available
    if (window.matchMedia) {
      const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
      const onChange = () => {
        checkMobile();
      };
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    } else {
      // Fallback for environments without matchMedia
      const handleResize = () => {
        checkMobile();
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  return !!isMobile;
}
