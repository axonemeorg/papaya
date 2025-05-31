import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite({ target: 'react', autoCodeSplitting: true }),
    react(),
  ],
  resolve: {
    preserveSymlinks: true,
    // alias: {
    //   // '@web/': `${path.resolve(__dirname, 'src')}/`,
    //   '@ui': path.resolve(__dirname, '../ui/src')

    //   // '@zisk/ui': path.resolve(__dirname, '../ui/src'),
    //   // '@zisk/ui/': `${path.resolve(__dirname, '../ui/src')}/`
    // }
  },
  // root: path.resolve('./src/web'),
  // build: {
  //   rollupOptions: {
  //     input: {
  //       app: './src/web/index.html',
  //     },
  //   },
  // },
  server: {
    port: 9476,
    host: '127.0.0.1',
    allowedHosts: [
      'ax0ne.me'
    ]
  }
})
