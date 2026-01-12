import { Request, Response } from 'express';
import argon2 from 'argon2';
import { Scanner, Event } from '../../models';

export const updateScanner = async (req: Request, res: Response) => {
    try {
        const { scannerId } = req.params;
        const { username, password, eventIds } = req.body;
        const userId = req.user!.id;
        const scanner = await Scanner.findOne({ where: { id: scannerId, userId } });
        if (!scanner) return res.status(404).json({ error: 'Scanner not found' });
        if (username) scanner.username = username;
        if (password) scanner.password = await argon2.hash(password);
        await scanner.save();
        if (Array.isArray(eventIds)) {
            const events = await Event.findAll({ where: { id: eventIds, organizerId: userId } });
            await scanner.setEvents(events);
        }
        res.json({ scanner });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update scanner' });
    }
};