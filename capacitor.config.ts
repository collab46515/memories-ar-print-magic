import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lovable.memoriesarapp',
  appName: 'Memories AR',
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