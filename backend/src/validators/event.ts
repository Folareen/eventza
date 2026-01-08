import { z } from 'zod';
import { COUNTRIES, STATES } from '../constants/locations';

export const createEventSchema = z.object({
    body: z.object({
        title: z.string().min(3, 'Title must be at least 3 characters').max(255, 'Title must not exceed 255 characters'),
        description: z.string().min(10, 'Description must be at least 10 characters'),
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
        time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Time must be in HH:MM or HH:MM:SS format'),
        venue: z.string().min(3, 'Venue must be at least 3 characters').max(255, 'Venue must not exceed 255 characters'),
        capacity: z.number().int().positive('Capacity must be a positive integer').min(1, 'Capacity must be at least 1'),
        bannerImage: z.string().url('Banner image must be a valid URL').optional(),
    }),
});

export const updateEventSchema = z.object({
    params: z.object({
        eventId: z.string().regex(/^\d+$/, 'Event ID must be a number'),
    }),
    body: z.object({
        title: z.string().min(3, 'Title must be at least 3 characters').max(255, 'Title must not exceed 255 characters').optional(),
        description: z.string().min(10, 'Description must be at least 10 characters').optional(),
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
        time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Time must be in HH:MM or HH:MM:SS format').optional(),
        venue: z.string().min(3, 'Venue must be at least 3 characters').max(255, 'Venue must not exceed 255 characters').optional(),
        capacity: z.number().int().positive('Capacity must be a positive integer').min(1, 'Capacity must be at least 1').optional(),
        bannerImage: z.string().url('Banner image must be a valid URL').optional(),
    }),
});

export const getEventSchema = z.object({
    params: z.object({
        eventId: z.string().regex(/^\d+$/, 'Event ID must be a number'),
    }),
});

export const eventListQuerySchema = z.object({
    country: z.string().optional().refine(
        val => !val || COUNTRIES.some(c => c.code === val),
        { message: 'Invalid country' }
    ),
    state: z.string().optional(),
    category: z.string().optional(),
    date: z.string().optional(),
    search: z.string().optional(),
    sort: z.enum(['date', 'createdAt']).optional(),
    order: z.enum(['asc', 'desc']).optional(),
    page: z.string().optional().default('1'),
    limit: z.string().optional().default('20'),
}).superRefine((data, ctx) => {
    if (data.state && data.country) {
        if (!STATES[data.country]?.includes(data.state)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Invalid state for country',
                path: ['state']
            });
        }
    }
});

export const deleteEventSchema = z.object({
    params: z.object({
        eventId: z.string().regex(/^\d+$/, 'Event ID must be a number'),
    }),
});
