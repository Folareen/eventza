import { Request, Response } from 'express';
import { Ticket, Event } from '../../models';

export const updateTicket = async (req: Request, res: Response) => {
    try {
        const { eventId, ticketId } = req.params;
        const { name, description, price, quantityAvailable } = req.body;
        const ticket = await Ticket.findOne({
            where: { id: ticketId, eventId },
            include: [{
                model: Event,
                as: 'event',
                where: { organizerId: req.user!.id },
            }],
        });
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }
        if (name !== undefined) ticket.name = name;
        if (description !== undefined) ticket.description = description;
        if (price !== undefined) ticket.price = price;
        if (quantityAvailable !== undefined) ticket.quantityAvailable = quantityAvailable;
        await ticket.save();
        res.status(200).json({ ticket });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update ticket' });
    }
};
