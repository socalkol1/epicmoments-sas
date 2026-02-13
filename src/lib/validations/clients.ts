import { z } from 'zod';

export const createClientSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  fullName: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  phone: z
    .string()
    .max(30, 'Phone must be less than 30 characters')
    .trim()
    .optional()
    .nullable(),
});

export type CreateClientInput = z.infer<typeof createClientSchema>;
