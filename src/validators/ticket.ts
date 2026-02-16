import { z } from 'zod';

export const createTicketSchema = z.object({
    params: z.object({
        eventId: z.string().regex(/^\d+$/, 'Event ID must be a number'),
    }),
    body: z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        price: z.number().nonnegative(),
        quantityAvailable: z.number().int().positive(),
    }),
});

export const updateTicketSchema = z.object({
    params: z.object({
        eventId: z.string().regex(/^\d+$/, 'Event ID must be a number'),
        ticketId: z.string().regex(/^\d+$/, 'Ticket ID must be a number'),
    }),
    body: z.object({
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        price: z.number().nonnegative().optional(),
        quantityAvailable: z.number().int().positive().optional(),
    }),
});

export const deleteTicketSchema = z.object({
    eventId: z.string().regex(/^\d+$/, 'Event ID must be a number'),
    ticketId: z.string().regex(/^\d+$/, 'Ticket ID must be a number'),
});

export const getEventTicketsSchema = z.object({
    eventId: z.string().regex(/^\d+$/, 'Event ID must be a number'),
});
