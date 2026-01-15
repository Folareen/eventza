import { z } from 'zod';
import { COUNTRIES, STATES } from '../constants/locations';
import { EVENT_CATEGORIES } from '../constants/event-categories';

export const createEventSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters').max(255, 'Title must not exceed 255 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Time must be in HH:MM or HH:MM:SS format'),
    venue: z.string().min(3, 'Venue must be at least 3 characters').max(255, 'Venue must not exceed 255 characters'),
    state: z.string().min(2, 'State must be at least 2 characters').max(100, 'State must not exceed 100 characters'),
    country: z.string().refine(
        val => COUNTRIES.some(c => c.name === val),
        { message: 'Invalid country' }
    ),
    category: z.string().min(3, 'Category must be at least 3 characters').max(100, 'Category must not exceed 100 characters'),
    capacity: z.preprocess((val) => (typeof val === 'string' ? parseInt(val, 10) : val), z.number().int().positive('Capacity must be a positive integer').min(1, 'Capacity must be at least 1')),
    bannerImage: z.string().url('Banner image must be a valid URL').optional(),
}).superRefine((data, ctx) => {
    if (data.state && data.country) {
        const countryCode = COUNTRIES.find(c => c.name === data.country)?.code || ''
        if (!STATES[countryCode]?.includes(data.state)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Invalid state for country',
                path: ['state']
            });
        }
    }
    if (data.category) {
        if (EVENT_CATEGORIES.indexOf(data.category) === -1) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Invalid event category',
                path: ['category']
            });
        }
    }
});

export const updateEventSchema = z.object({
    eventId: z.string().regex(/^\d+$/, 'Event ID must be a number').optional(),
    title: z.string().min(3, 'Title must be at least 3 characters').max(255, 'Title must not exceed 255 characters').optional(),
    description: z.string().min(10, 'Description must be at least 10 characters').optional(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
    time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Time must be in HH:MM or HH:MM:SS format').optional(),
    venue: z.string().min(3, 'Venue must be at least 3 characters').max(255, 'Venue must not exceed 255 characters').optional(),
    state: z.string().min(2, 'State must be at least 2 characters').max(100, 'State must not exceed 100 characters').optional(),
    country: z.string().optional().refine(
        val => !val || COUNTRIES.some(c => c.name === val),
        { message: 'Invalid country' }
    ),
    category: z.string().min(3, 'Category must be at least 3 characters').max(100, 'Category must not exceed 100 characters').optional(),
    capacity: z.preprocess((val) => (typeof val === 'string' ? parseInt(val, 10) : val), z.number().int().positive('Capacity must be a positive integer').min(1, 'Capacity must be at least 1')).optional(),
    bannerImage: z.string().url('Banner image must be a valid URL').optional(),
}).superRefine((data, ctx) => {
    if (data.state && data.country) {
        const countryCode = COUNTRIES.find(c => c.name === data.country)?.code || ''
        if (!STATES[countryCode]?.includes(data.state)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Invalid state for country',
                path: ['state']
            });
        }
    }
    if (data.category) {
        if (EVENT_CATEGORIES.indexOf(data.category) === -1) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Invalid event category',
                path: ['category']
            });
        }
    }
});

export const getEventSchema = z.object({
    eventId: z.string().regex(/^\d+$/, 'Event ID must be a number'),
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
    eventId: z.string().regex(/^\d+$/, 'Event ID must be a number'),
});
