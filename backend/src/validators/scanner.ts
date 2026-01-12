import { z } from 'zod';

export const createScannerSchema = z.object({
    body: z.object({
        username: z.string().min(3),
        password: z.string().min(8),
        eventIds: z.array(z.number()).optional(),
    }),
});

export const updateScannerSchema = z.object({
    params: z.object({
        scannerId: z.string().regex(/^\d+$/),
    }),
    body: z.object({
        username: z.string().min(3).optional(),
        password: z.string().min(8).optional(),
        eventIds: z.array(z.number()).optional(),
    }),
});

export const scannerLoginSchema = z.object({
    body: z.object({
        username: z.string().min(3),
        password: z.string().min(8),
    }),
});
