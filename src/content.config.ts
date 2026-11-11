import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// The admin panel may save empty fields as null — treat null as “not set”.
const N = <T extends z.ZodTypeAny>(schema: T) => z.preprocess((v) => (v === null ? undefined : v), schema);
const str = () => N(z.string().optional());

// SEO block shared by every editable entry (filled in the admin panel, all optional)
const seo = N(z
  .object({
    title: str(),
    description: str(),
    keywords: str(),
    image: str(),
    noindex: N(z.boolean().optional()),
  })
  .optional());

// Optional call-to-action button with an external or internal link
const button = N(z
  .object({
    label: str(),
    url: str(),
  })
  .optional());

const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    showDate: N(z.boolean().default(true)),
    category: N(z.enum(['Offers', 'Services', 'Tools', 'Network news', 'Events']).default('Network news')),
    tag: str(),
    summary: z.string(),
    image: str(),
    imageAlt: str(),
    video: str(),
    featured: N(z.boolean().default(false)),
    note: str(),
    button,
    draft: N(z.boolean().default(false)),
    seo,
  }),
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    category: z.enum(['Events & MICE', 'Representation office', 'People & HR', 'Market entry', 'Marketing', 'Compliance']),
    icon: N(z.string().default('match')),
    badge: N(z.enum(['', 'New', 'Special offer']).default('')),
    summary: z.string(),
    points: N(z.array(z.string()).default([])),
    price: N(z.string().default('Price on request')),
    order: N(z.number().default(100)),
    image: str(),
    imageAlt: str(),
    video: str(),
    facts: N(z.array(z.object({ label: z.string(), value: z.string() })).default([])),
    included: N(z.array(z.object({ title: z.string(), text: str() })).default([])),
    steps: N(z.array(z.object({ title: z.string(), text: str() })).default([])),
    why: N(z.array(z.object({ title: z.string(), text: str() })).default([])),
    formType: N(z.enum(['general', 'event']).default('general')),
    button,
    draft: N(z.boolean().default(false)),
    seo,
  }),
});

const countries = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/countries' }),
  schema: z.object({
    name: z.string(),
    region: z.enum(['European Union', 'Eastern Partnership', 'Africa']),
    capital: str(),
    currency: str(),
    summary: z.string(),
    associations: N(z
      .array(
        z.object({
          name: z.string(),
          role: str(),
          website: str(),
          contact: str(),
          logo: str(),
        }),
      )
      .default([])),
    links: N(z.array(z.object({ label: z.string(), url: z.string() })).default([])),
    seo,
  }),
});

export const collections = { news, services, countries };
