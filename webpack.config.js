const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // 개발 서버에 프록시 설정 추가
  if (env.mode === 'development') {
    config.devServer = {
      ...config.devServer,
      proxy: {
        '/api': {
          target: 'http://122.40.46.59',
          changeOrigin: true,
          secure: false,
          logLevel: 'debug',
        },
      },
    };
  }

  return config;
};