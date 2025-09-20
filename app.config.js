module.exports = {
  expo: {
    name: "RipplePay",
    slug: "ripplepay-rn",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "ripplepay",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      }
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router"
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      // 환경 변수들을 여기에 정의
      serverHost: process.env.SERVER_HOST || 'http://localhost:8081',
      apiTimeout: process.env.API_TIMEOUT || '30000',
      environment: process.env.NODE_ENV || 'development',
    }
  }
};