import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist', // Çıktı klasörü
    emptyOutDir: true,
  },
  server: {
    proxy: {
      // Localde çalışırken API isteklerini backend'e yönlendirir
      '/api': 'http://localhost:3000' 
    }
  }
});