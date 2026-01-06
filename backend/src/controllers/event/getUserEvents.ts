import { Request, Response } from 'express';
import Event from '../../models/Event';

export const getUserEvents = async (req: Request, res: Response) => {
    try {
        const events = await Event.findAll({
            where: {
                organizerId: req.user!.id,
            },
            order: [['date', 'ASC']],
        });

        res.status(200).json({ events });
    } catch (error) {
        console.error('Get user events error:', error);
        res.status(500).json({ error: 'Failed to get your events' });
    }
};
