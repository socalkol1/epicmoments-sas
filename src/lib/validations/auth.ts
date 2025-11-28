import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const signupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  studioName: z
    .string()
    .min(2, 'Studio name must be at least 2 characters')
    .max(100, 'Studio name must be less than 100 characters'),
  slug: z
    .string()
    .min(3, 'Slug must be at least 3 characters')
    .max(30, 'Slug must be less than 30 characters')
    .regex(
      /^[a-z0-9][a-z0-9-]*[a-z0-9]$/,
      'Slug must be lowercase alphanumeric with hyphens, cannot start or end with hyphen'
    )
    .refine(
      (slug) => !['www', 'app', 'api', 'admin', 'support', 'help', 'mail', 'ftp'].includes(slug),
      'This slug is reserved'
    ),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
