import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodSchema } from 'zod';

type RequestPart = 'body' | 'query' | 'params';

export const validate = (schema: ZodSchema, part: RequestPart = 'body') => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            let data;
            if (part === 'body') data = req.body;
            else if (part === 'query') data = req.query;
            else if (part === 'params') data = req.params;
            await schema.parseAsync(data);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errors = error.issues.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));
                return res.status(400).json({
                    error: 'Validation failed',
                    details: errors,
                });
            }
            next(error);
        }
    };
};
