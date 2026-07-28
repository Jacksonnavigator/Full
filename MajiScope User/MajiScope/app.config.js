module.exports = {
  expo: {
    name: 'MajiScope User',
    slug: 'majiscope-user',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './majiscope/assets/app-icon.png',
    userInterfaceStyle: 'light',
    assetBundlePatterns: ['**/*'],
    splash: {
      image: './majiscope/assets/splash-screen.png',
      resizeMode: 'contain',
      backgroundColor: '#eef9ff',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.hydratech.majiscopeuser',
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      package: 'com.hydratech.majiscopeuser',
      permissions: [
        'android.permission.ACCESS_COARSE_LOCATION',
        'android.permission.ACCESS_FINE_LOCATION',
        'android.permission.CAMERA',
        'android.permission.RECORD_AUDIO',
      ],
    },
    plugins: ['expo-location', 'expo-image-picker', 'expo-font'],
    extra: {
      eas: {
        projectId: 'cf87640f-9936-4957-8766-ecc8f2e28a7b',
      },
    },
  },
};
