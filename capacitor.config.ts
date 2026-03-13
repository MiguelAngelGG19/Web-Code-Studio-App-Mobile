import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.webcode.activa',
  appName: 'Activa',
  webDir: 'www',
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '344718478704-o5u464iv22e74avqs18u4f077i5e3312.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
  },
};

export default config;
