import { Request, Response } from 'express';
import { Order } from '../../models';

export const getOrder = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findByPk(orderId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.status(200).json({ order });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get order' });
    }
};
