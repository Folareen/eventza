import { Request, Response } from 'express';
import Event from '../../models/Event';
import User from '../../models/User';

export const getEvent = async (req: Request, res: Response) => {
    try {
        const { eventId } = req.params;
        const event = await Event.findOne({
            where: { id: eventId, organizerId: req.user!.id },
            include: [
                {
                    model: User,
                    as: 'organizer',
                    attributes: ['id', 'firstName', 'lastName', 'email'],
                },
            ],
        });
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.status(200).json({ event });
    } catch (error) {
        console.error('Get event error:', error);
        res.status(500).json({ error: 'Failed to get event' });
    }
};
