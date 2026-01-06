import { Request, Response } from 'express';
import { Ticket, Event } from '../../models';

export const createTicket = async (req: Request, res: Response) => {
    try {
        const { eventId } = req.params;
        const { name, description, price, quantityAvailable } = req.body;
        const event = await Event.findByPk(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        const ticket = await Ticket.create({
            eventId: Number(eventId),
            name,
            description,
            price,
            quantityAvailable,
            quantitySold: 0,
        });
        res.status(201).json({ ticket });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create ticket' });
    }
};
