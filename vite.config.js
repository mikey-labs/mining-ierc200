import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
export default defineConfig(({ command, mode }) => {
  return {
    plugins: [vue()],
    root: './src/renderer/',
    base: './',
    build: {
      emptyOutDir: true,
      target: 'chrome58',
      polyfillModulePreload: true,
      rollupOptions: {
        input: './src/renderer/src/main.js',
        output: {
          dir: 'dist',
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
        }
      },
    }
  };
});
