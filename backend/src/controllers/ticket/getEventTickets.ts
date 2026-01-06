import { Request, Response } from 'express';
import { Ticket, Event } from '../../models';

export const getEventTickets = async (req: Request, res: Response) => {
    try {
        const { eventId } = req.params;
        const event = await Event.findOne({ where: { id: eventId, organizerId: req.user!.id } });
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        const tickets = await Ticket.findAll({ where: { eventId } });
        res.status(200).json({ tickets });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get tickets' });
    }
};
