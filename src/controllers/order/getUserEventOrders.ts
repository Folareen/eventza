import { Request, Response } from 'express';
import Order from '../../models/Order';
import Ticket from '../../models/Ticket';
import Event from '../../models/Event';

export const getUserEventOrders = async (req: Request, res: Response) => {
    try {
        const { eventId } = req.params;
        const { ticketId } = req.query;
        const event = await Event.findOne({
            where: {
                id: eventId,
                organizerId: req.user!.id,
            },
        });
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        let ticketIds: number[] = [];
        if (ticketId) {
            if (Array.isArray(ticketId)) {
                ticketIds = ticketId.map(id => Number(id)).filter(id => !isNaN(id));
            } else {
                const idNum = Number(ticketId);
                if (!isNaN(idNum)) ticketIds = [idNum];
            }
        } else {
            const tickets = await Ticket.findAll({ where: { eventId } });
            ticketIds = tickets.map(t => t.id);
        }
        const orders = await Order.findAll({ where: { ticketId: ticketIds } });
        res.json({ orders });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get orders' });
    }
};
