import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			// /esm/icons/index.mjs only exports the icons statically, so no separate chunks are created
			"@tabler/icons-react": "@tabler/icons-react/dist/esm/icons/index.mjs",
		},
	},
	server: {
		host: true,
		proxy: {
			"/api/verify-captcha": {
				target: "https://hcaptcha.com/siteverify",
				changeOrigin: true,
				secure: true,
				rewrite: (path) => path.replace(/^\/api\/verify-captcha/, ""),
			},
		},
	},
});
