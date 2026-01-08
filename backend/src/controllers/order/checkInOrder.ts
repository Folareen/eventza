import { Request, Response } from 'express';
import { Order } from '../../models';

export const checkInOrder = async (req: Request, res: Response) => {
    try {
        const { code } = req.body;
        if (!code) {
            return res.status(400).json({ error: 'Order code is required' });
        }
        const order = await Order.findOne({ where: { code } });
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
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
