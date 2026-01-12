import { Request, Response } from 'express';
import { Scanner } from '../../models';

export const getScannerEvents = async (req: Request, res: Response) => {
    try {
        const { scannerId } = req.params;
        const scanner = await Scanner.findByPk(scannerId, { include: ['events'] });
        if (!scanner) return res.status(404).json({ error: 'Scanner not found' });
        res.json({ events: scanner.events });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch events' });
    }
};