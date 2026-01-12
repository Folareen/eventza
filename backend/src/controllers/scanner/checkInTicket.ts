import { Request, Response } from 'express';
import { Order, Event, Scanner } from '../../models';
import jwt from 'jsonwebtoken';

const SCANNER_JWT_SECRET = process.env.ACCESS_TOKEN_SECRET!;

function getScannerFromToken(req: Request) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    const token = authHeader.substring(7);
    try {
        return jwt.verify(token, SCANNER_JWT_SECRET) as { scannerId: number; eventIds: number[] };
    } catch {
        return null;
    }
}

export const checkInTicket = async (req: Request, res: Response) => {
    try {
        const { eventId } = req.params;
        const { code } = req.body;
        const scannerPayload = getScannerFromToken(req);
        if (!scannerPayload) return res.status(401).json({ error: 'Unauthorized' });
        if (!scannerPayload.eventIds.includes(Number(eventId))) {
            return res.status(403).json({ error: 'Scanner not allowed for this event' });
        }
        const event = await Event.findByPk(eventId);
        if (!event) return res.status(404).json({ error: 'Event not found' });
        const order = await Order.findOne({ where: { code } });
        if (!order) return res.status(404).json({ error: 'Order not found' });
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
