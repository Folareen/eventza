import { Request, Response } from 'express';
import Ticket from '../../models/Ticket';
import Event from '../../models/Event';

export const getUserEventTicket = async (req: Request, res: Response) => {
    try {
        const { eventId, ticketId } = req.params;
        const event = await Event.findOne({
            where: {
                id: eventId,
                organizerId: req.user!.id,
            },
        });
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        const ticket = await Ticket.findOne({ where: { id: ticketId, eventId } });
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }
        res.json({ ticket });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get ticket' });
    }
};
