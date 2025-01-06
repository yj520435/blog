const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: true,
  outputDir: 'docs',
  devServer: {
    proxy: {
      '/drive': {
        target: 'https://googleapis.com/drive',
        changeOrigin: true,
      },
    },
  },
});
