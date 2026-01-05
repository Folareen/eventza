import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodSchema } from 'zod';

export const validate = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errors = error.issues.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));
                return res.status(400).json({
                    error: "Validation failed",
                    details: errors,
                });
            }
            next(error);
        }
    };
};
