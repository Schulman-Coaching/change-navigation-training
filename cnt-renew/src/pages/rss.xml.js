import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE } from '../config';

export async function GET(context) {
  const blog = await getCollection('blog');
  return rss({
    title: SITE.name,
    description: SITE.description,
    site: context.site,
    items: blog.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.excerpt || '',
      link: `/blog/${post.data.slug}/`,
    })),
  });
}
