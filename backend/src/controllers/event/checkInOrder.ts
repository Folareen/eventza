import { Request, Response } from 'express';
import { Order, Event } from '../../models';

export const checkInOrder = async (req: Request, res: Response) => {
    try {
        const { eventId } = req.params;
        const { code } = req.body;
        if (!code) {
            return res.status(400).json({ error: 'Order code is required' });
        }
        const event = await Event.findByPk(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        if (!req.user || event.organizerId !== req.user.id) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        const order = await Order.findOne({ where: { code } });
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        if ((order as any).ticketId) {
            const ticket = await (order as any).getTicket?.();
            if (ticket && ticket.eventId !== event.id) {
                return res.status(400).json({ error: 'Order does not belong to this event' });
            }
        }
        if (order.checkedIn) {
            return res.json({ message: 'Already checked in', order });
        }
        order.checkedIn = true;
        await order.save();
        res.json({ message: 'Check-in successful', order });
    } catch (error) {
        res.status(500).json({ error: 'Failed to check in' });
    }
};
