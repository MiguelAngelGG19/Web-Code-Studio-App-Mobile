import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.webcode.activa',
  appName: 'Activa',
  webDir: 'www',
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      clientId: '344718478704-vrgp1hbh0fut5ocibm0r4n90e2a36ea4.apps.googleusercontent.com',
      serverClientId: '344718478704-o5u464iv22e74avqs18u4f077i5e3312.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
  },
};

export default config;
