import { Request, Response } from 'express';
import Event from '../../models/Event';

export const getUserEvent = async (req: Request, res: Response) => {
    try {
        const { eventId } = req.params;
        const event = await Event.findOne({
            where: {
                id: eventId,
                organizerId: req.user!.id,
            },
        });
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.json({ event });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get event' });
    }
};
