import { Request, Response } from 'express';

export const getCurrentScanner = async (req: Request, res: Response) => {
    try {
        const scanner = req.scanner;

        console.log(scanner, 'scanner in getCurrentScanner');
        if (!scanner) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        res.json({ scanner });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Failed to fetch events' });
    }
};