// import { defineConfig } from 'vite';
// import laravel from 'laravel-vite-plugin';

// export default defineConfig({
//     plugins: [
//         laravel({
//             input: ['resources/css/app.css', 'resources/js/app.js'],
//             refresh: true,
//         }),
//     ],
// });

import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react'; // <- 追加

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
    ],
    // resolve: {
    //     alias: {
    //         '@': '/resources/ts',
    //     },
    // },
});