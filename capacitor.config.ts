import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.5c9ad63012a94ddbbfa47a1da675cfd2',
  appName: 'memories-ar-print-magic',
  webDir: 'dist',
  server: {
    url: 'https://5c9ad630-12a9-4ddb-bfa4-7a1da675cfd2.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Camera: {
      permissions: ['camera']
    }
  }
};

export default config;