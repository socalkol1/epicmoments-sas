import { z } from 'zod';

export const createAlbumSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters')
    .trim(),
  description: z
    .string()
    .max(1000, 'Description must be less than 1000 characters')
    .trim()
    .optional()
    .nullable(),
  clientId: z.string().uuid().optional().nullable(),
});

export type CreateAlbumInput = z.infer<typeof createAlbumSchema>;
