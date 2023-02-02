import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react'; // <- 追加
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    // safari では表示されなかった
    // https://laracasts.com/discuss/channels/vite/laravel-vite-issue?page=1&replyId=807406
    server: {
        hmr: {
            host: 'localhost',
        },
    },
    plugins: [
        laravel({
            // input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
            // typescriptとsassが使えるように変更
            input: [
                // 'resources/sass/app.scss', 
                'resources/ts/index.tsx'
            ],
        }),
        react(), // <- 追加

        // https://vite-pwa-org.netlify.app/guide/pwa-minimal-requirements.html
        // https://software.pitang1965.com/2022/04/23/how-to-make-a-vite-react-typescript-project-a-pwa/
        VitePWA({
            includeAssets: [
            //   'offline.html',
              'favicon.svg',
              'favicon.ico',
              'robots.txt',
              'apple-touch-icon.png',
            ],
            manifest: {
                "theme_color": "#e4007f",
                "background_color": "#e4007f",
                // "display": "browser",
                "display": "standalone",
                "scope": "/",
                "start_url": "/",
                "name": "Vlides",
                "short_name": "Vlides",
                "description": "Slides with Voice",
                "icons": [
                    {
                        "src": "/icon-192x192.png",
                        "sizes": "192x192",
                        "type": "image/png"
                    },
                    {
                        "src": "/icon-256x256.png",
                        "sizes": "256x256",
                        "type": "image/png"
                    },
                    {
                        "src": "/icon-384x384.png",
                        "sizes": "384x384",
                        "type": "image/png"
                    },
                    {
                        "src": "/icon-512x512.png",
                        "sizes": "512x512",
                        "type": "image/png",
                        "purpose": "any maskable",
                    }
                ]
            }
        }),
    ],
    // resolve: {
    //     alias: {
    //         '@': '/resources/ts',
    //     },
    // },
});