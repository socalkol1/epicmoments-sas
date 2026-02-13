import { z } from 'zod';

export const createTagSchema = z.object({
  name: z
    .string()
    .min(1, 'Tag name is required')
    .max(50, 'Tag name must be less than 50 characters')
    .trim(),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, 'Color must be a valid hex color')
    .optional()
    .default('#6366f1'),
  description: z
    .string()
    .max(200, 'Description must be less than 200 characters')
    .trim()
    .optional()
    .nullable(),
});

export const searchTagsSchema = z.object({
  query: z.string().max(50).trim().optional().default(''),
  limit: z.number().int().min(1).max(50).optional().default(20),
});

export type CreateTagInput = z.infer<typeof createTagSchema>;
export type SearchTagsInput = z.infer<typeof searchTagsSchema>;
