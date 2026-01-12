import { Request, Response } from 'express';
import argon2 from 'argon2';
import { Scanner, Event } from '../../models';

export const createScanner = async (req: Request, res: Response) => {
    try {
        const { username, password, eventIds } = req.body;
        const userId = req.user!.id;
        const existing = await Scanner.findOne({ where: { username } });
        if (existing) {
            return res.status(409).json({ error: 'Username already exists' });
        }
        const hashed = await argon2.hash(password);
        const scanner = await Scanner.create({ username, password: hashed, userId });
        if (Array.isArray(eventIds) && eventIds.length > 0) {
            const events = await Event.findAll({ where: { id: eventIds, organizerId: userId } });
            await scanner.setEvents(events);
        }
        res.status(201).json({ scanner });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create scanner' });
    }
};