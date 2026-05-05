import { Request, Response } from 'express';
import { Ticket, Event } from '../../models';

export const createTicket = async (req: Request, res: Response) => {
    try {
        const { eventId } = req.params;
        const { name, description, price, quantityAvailable } = req.body;
        const user = req.user!;

        // Authorization check: user must own the event
        const event = await Event.findOne({
            where: { id: eventId, organizerId: user.id },
        });

        if (!event) {
            return res.status(403).json({ error: 'Not authorized to create tickets for this event' });
        }
        const ticket = Ticket.build({
            eventId: Number(eventId),
            name,
            description,
            price,
            quantityAvailable,
        });

        await ticket.save();

        res.status(201).json({ ticket });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create ticket' });
    }
};
