import { Request, Response } from 'express';
import { Ticket, Event } from '../../models';

export const getEventTickets = async (req: Request, res: Response) => {
    try {
        const { eventId } = req.params;

        const event = await Event.findOne({ where: { id: eventId }, include: ['tickets'] });
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.status(200).json({ event });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to get tickets' });
    }
};
