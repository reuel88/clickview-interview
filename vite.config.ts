import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      {
        find: '@/ui',
        replacement: path.resolve(__dirname, './src/components/ui'),
      },
      { find: '@/hooks', replacement: path.resolve(__dirname, './src/hooks') },
      {
        find: '@/providers',
        replacement: path.resolve(__dirname, './src/providers'),
      },
      { find: '@/utils', replacement: path.resolve(__dirname, './src/utils') },
      { find: '@', replacement: path.resolve(__dirname, './src') },
    ],
  },
})
