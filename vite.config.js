// import { sveltekit } from '@sveltejs/kit/vite';
// import { defineConfig } from 'vite';

// export default defineConfig({
//   plugins: [sveltekit()]
// });


import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  ssr: {
    // This tells Vite to let the Cloudflare runtime handle these modules
    external: ['node:assert', 'node:crypto', 'node:path', 'node:url']
  }
});