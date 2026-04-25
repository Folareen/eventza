import { z } from 'zod';

export const createOrderSchema = z.object({
    params: z.object({
        eventId: z.string().regex(/^\d+$/, 'Event ID must be a number'),
        ticketId: z.string().regex(/^\d+$/, 'Ticket ID must be a number'),
    }),
    body: z.object({
        name: z.string().min(2).max(100),
        email: z.string().email(),
        quantity: z.number().int().min(1).max(10),
    }),
});
