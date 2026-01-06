import { Request, Response } from 'express';
import { Ticket, Event } from '../../models';

export const deleteTicket = async (req: Request, res: Response) => {
    try {
        const { eventId, ticketId } = req.params;
        const ticket = await Ticket.findOne({
            where: { id: ticketId, eventId },
            include: [{
                model: Event,
                as: 'event',
                where: { organizerId: req.user!.id },
            }],
        });
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found or forbidden' });
        }
        await ticket.destroy();
        res.status(200).json({ message: 'Ticket deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete ticket' });
    }
};
