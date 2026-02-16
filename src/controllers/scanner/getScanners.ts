import { Request, Response } from 'express';
import { Scanner } from '../../models';

export const getScanners = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const scanners = await Scanner.findAll({ where: { userId }, include: ['events'], attributes: { exclude: ['password'] } });
        res.json({ scanners });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch scanners' });
    }
};