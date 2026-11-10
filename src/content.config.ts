import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// SEO block shared by every editable entry (filled in the admin panel, all optional)
const seo = z
  .object({
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.string().optional(),
    image: z.string().optional(),
    noindex: z.boolean().optional(),
  })
  .optional();

// Optional call-to-action button with an external or internal link
const button = z
  .object({
    label: z.string().optional(),
    url: z.string().optional(),
  })
  .optional();

const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    showDate: z.boolean().default(true),
    category: z.enum(['Offers', 'Services', 'Tools', 'Network news', 'Events']).default('Network news'),
    tag: z.string().optional(),
    summary: z.string(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    featured: z.boolean().default(false),
    note: z.string().optional(),
    button,
    draft: z.boolean().default(false),
    seo,
  }),
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    category: z.enum(['Events & MICE', 'Representation office', 'People & HR', 'Market entry', 'Marketing', 'Compliance']),
    icon: z.string().default('match'),
    badge: z.enum(['', 'New', 'Special offer']).default(''),
    summary: z.string(),
    points: z.array(z.string()).default([]),
    price: z.string().default('Price on request'),
    order: z.number().default(100),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    facts: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
    included: z.array(z.object({ title: z.string(), text: z.string().optional() })).default([]),
    steps: z.array(z.object({ title: z.string(), text: z.string().optional() })).default([]),
    why: z.array(z.object({ title: z.string(), text: z.string().optional() })).default([]),
    formType: z.enum(['general', 'event']).default('general'),
    button,
    draft: z.boolean().default(false),
    seo,
  }),
});

const countries = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/countries' }),
  schema: z.object({
    name: z.string(),
    region: z.enum(['European Union', 'Eastern Partnership', 'Africa']),
    capital: z.string().optional(),
    currency: z.string().optional(),
    summary: z.string(),
    associations: z
      .array(
        z.object({
          name: z.string(),
          role: z.string().optional(),
          website: z.string().optional(),
          contact: z.string().optional(),
          logo: z.string().optional(),
        }),
      )
      .default([]),
    links: z.array(z.object({ label: z.string(), url: z.string() })).default([]),
    seo,
  }),
});

export const collections = { news, services, countries };
