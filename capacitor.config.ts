import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.legalxgen.app',
  appName: 'Legalxgen mobile',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
