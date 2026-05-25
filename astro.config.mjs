import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.changenavigationtraining.com',
  build: {
    format: 'file',
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },
});
