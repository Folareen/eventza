import { z } from 'zod';

export const createOrderSchema = z.object({
    body: z.object({
        ticketId: z.string().regex(/^\d+$/, 'Ticket ID must be a number'),
        name: z.string().min(2).max(100),
        email: z.string().email(),
        quantity: z.number().int().min(1).max(10),
    }),
});

export const getOrderSchema = z.object({
    params: z.object({
        orderId: z.string().regex(/^\d+$/, 'Order ID must be a number'),
    }),
});
