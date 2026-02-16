import { Request, Response } from 'express';
import { Order, Event } from '../../models';

export const checkInTicket = async (req: Request, res: Response) => {
    try {
        const { eventId } = req.params;
        const { code } = req.body;
        const scanner = req.scanner;

        if (!code) {
            return res.status(400).json({ error: 'Ordered ticket code is required' });
        }
        if (!scanner) return res.status(401).json({ error: 'Unauthorized' });

        const eventIds = scanner.events?.map((event: Event) => Number(event.id)) || [];
        if (!eventIds.includes(Number(eventId))) {
            return res.status(403).json({ error: 'Scanner not allowed for this event' });
        }

        const event = await Event.findByPk(eventId);
        if (!event) return res.status(404).json({ error: 'Event not found' });

        const order = await Order.findOne({ where: { code } });
        if (!order) return res.status(404).json({ error: 'Order not found' });
        if ((order as Order).ticketId) {
            const ticket = await order?.getTicket?.();
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
        console.log(error);
        res.status(500).json({ error: 'Failed to check in' });
    }
};
