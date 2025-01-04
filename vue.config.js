const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: true,
  outputDir: 'docs',
  devServer: {
    proxy: {
      '/macros': {
        target: 'https://script.google.com',
        changeOrigin: true,
      },
    },
  },
});
