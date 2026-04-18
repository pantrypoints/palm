import adapter from '@sveltejs/adapter-cloudflare'; 
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    // adapter-cloudflare doesn't usually need extra config for basic builds
    adapter: adapter()
  }
};

export default config;

