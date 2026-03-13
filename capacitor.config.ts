import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cricket.scoreboard',
  appName: 'Cricket Scoreboard',
  webDir: 'www',
  server: {
    androidScheme: 'file'
  }
};

export default config;
