import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['react-redux', 'react-infinite-scroll-component', 'redux-persist/integration/react', '@mui/icons-material/VideoLibrary', "redux-persist/lib/storage", 'react-router-dom', 'redux-persist', 'react-modal', '@reduxjs/toolkit'],
    },
    minify: true,
    cssCodeSplit: true,
  },
});