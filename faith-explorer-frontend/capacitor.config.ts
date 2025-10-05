import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.faithexplorer.app',
  appName: 'Faith Explorer',
  webDir: 'dist',
  ios: {
    contentInset: 'always'
  }
};

export default config;
