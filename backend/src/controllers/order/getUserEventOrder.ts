import { Request, Response } from 'express';
import Order from '../../models/Order';
import Ticket from '../../models/Ticket';
import Event from '../../models/Event';

export const getUserEventOrder = async (req: Request, res: Response) => {
    try {
        const { eventId, orderId } = req.params;
        const event = await Event.findOne({
            where: {
                id: eventId,
                organizerId: req.user!.id,
            },
        });
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        const order = await Order.findOne({ where: { id: orderId } });
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        const ticket = await Ticket.findOne({ where: { id: order.ticketId, eventId } });
        if (!ticket) {
            return res.status(404).json({ error: 'Order does not belong to this event' });
        }
        res.json({ order });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get order' });
    }
};
