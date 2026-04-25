import { Request, Response } from 'express';
import { Scanner } from '../../models';

export const deleteScanner = async (req: Request, res: Response) => {
    try {
        const { scannerId } = req.params;
        const userId = req.user!.id;
        const scanner = await Scanner.findOne({ where: { id: scannerId, userId } });
        if (!scanner) return res.status(404).json({ error: 'Scanner not found' });
        await scanner.destroy();
        res.json({ message: 'Scanner deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete scanner' });
    }
};