import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.renew.changenavigationtraining.com',
  build: {
    format: 'directory',
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },
});
