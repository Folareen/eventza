import { Request, Response } from 'express';
import Event from '../../models/Event';

export const getAllEvents = async (req: Request, res: Response) => {
    try {
        const events = await Event.findAll({
            order: [['date', 'ASC']],
        });

        res.status(200).json({ events });
    } catch (error) {
        console.error('Get all events error:', error);
        res.status(500).json({ error: 'Failed to get events' });
    }
};
