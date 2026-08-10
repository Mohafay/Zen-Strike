import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      injectRegister: false,
      // Desktop-Chrome-only: no orientation lock, no maskable/apple-touch
      // icons (those are Android/iOS adaptive-icon concerns).
      manifest: {
        name: 'Outreach Tracker',
        short_name: 'Outreach',
        description: 'Personal daily outreach checklist and streak tracker',
        theme_color: '#0b0f14',
        background_color: '#0b0f14',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,png,jpg,jpeg,webp,svg,webmanifest}']
      },
      devOptions: {
        enabled: true,
        type: 'module'
      }
    })
  ],
  server: {
    host: true
  }
});
