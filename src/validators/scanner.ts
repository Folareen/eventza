import { z } from 'zod';

export const createScannerSchema = z.object({
    username: z.string().min(3),
    password: z.string().min(8),
    eventIds: z.array(z.number()).optional(),
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
    username: z.string().min(3),
    password: z.string().min(8),
});

export const checkInTicketSchema = z.object({
    params: z.object({
        eventId: z.string().regex(/^\d+$/),
    }),
    body: z.object({
        code: z.string().min(1),
    }),
});