import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    date: z.date(),
    modified: z.date().optional(),
    excerpt: z.string().optional(),
    categories: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    word_count: z.number().optional(),
  }),
});

const workshops = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/workshops' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    excerpt: z.string(),
    format: z.enum(['single', 'multi-session', 'ongoing']),
    sessions: z.number(),
    duration: z.string(),
    level: z.enum(['beginner', 'intermediate', 'all-levels']),
    category: z.enum([
      'ai-literacy',
      'change-navigation',
      'practical-tools',
      'career',
      'education',
    ]),
    cohort: z.string(),
    startDate: z.date(),
    dayOfWeek: z.string(),
    time: z.string(),
    timezone: z.string(),
    price: z.string(),
    spots: z.number().optional(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { blog, workshops };
