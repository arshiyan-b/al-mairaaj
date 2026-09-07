import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            // ✅ Keep your existing Laravel dashboards
            input: [
                'resources/css/app.css',
                'resources/js/app.js',

                // ✅ Add your React dashboard entry
                // 'resources/js/app.jsx',
                'resources/js/React-student/app.jsx',
                'resources/js/React-teacher/app.jsx',
            ],
            refresh: true,
        }),
        tailwindcss(),
        react(), // ✅ Enable React
    ],
    resolve: {
    alias: {
      '@': path.resolve(__dirname, 'resources/js/React-student'),
    }
}

})