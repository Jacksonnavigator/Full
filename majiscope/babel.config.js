module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@': './src',
            '@components': './src/components',
            '@screens': './src/screens',
            '@navigation': './src/navigation',
            '@data': './src/data',
            '@store': './src/store',
            '@utils': './src/utils',
            '@hooks': './src/hooks',
            '@services': './src/services',
            '@lib': './src/lib',
          },
        },
      ],
    ],
  };
};
