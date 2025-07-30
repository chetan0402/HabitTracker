import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const base = process.env.NODE_ENV === 'production' ? process.env.BASE_PATH ?? '' : '';

export default defineConfig({
	base,
	plugins: [
		sveltekit(),
		VitePWA({
			registerType: 'autoUpdate',
			workbox: {
				globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}']
			},
			manifest: {
				short_name: 'HabitTracker',
				name: 'Habit Tracker PWA',
				start_url: base || '/',
				scope: base || '/',
				display: 'standalone',
				theme_color: '#2563eb',
				background_color: '#ffffff',
				icons: [
					{
						src: `${base}/icons/icon-192x192.png`,
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: `${base}/icons/icon-512x512.png`,
						sizes: '512x512',
						type: 'image/png'
					},
					{
						src: `${base}/icons/icon-512x512.png`,
						sizes: '512x512',
						type: 'image/png',
						purpose: 'any maskable'
					}
				]
			},
			devOptions: {
				enabled: true
			}
		})
	]
});
