import { z } from 'zod';
import { COUNTRIES, STATES } from '../constants/locations';

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
