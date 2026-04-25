import { Request, Response } from 'express';
import { Order, Ticket } from '../../models';
import type { OrderStatus } from '../../models/Order';
import { v4 as uuidv4 } from 'uuid';

export const createOrder = async (req: Request, res: Response) => {
    try {
        const { name, email, quantity } = req.body;
        const ticketId = Number(req.params.ticketId);

        const ticket = await Ticket.findByPk(ticketId);
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }
        if (ticket.quantityAvailable - ticket.quantitySold < quantity) {
            return res.status(400).json({ error: 'Not enough tickets available' });
        }

        let orders: Order[] = [];
        let created = false;
        while (!created) {
            const orderData = Array.from({ length: quantity }).map(() => ({
                ticketId,
                name,
                email,
                amount: ticket.price,
                code: uuidv4(),
                status: (ticket.price === 0 ? 'confirmed' : 'pending') as OrderStatus,
                createdAt: new Date(),
                updatedAt: new Date(),
            }));
            try {
                orders = await Order.bulkCreate(orderData, { validate: true });
                created = true;
            } catch (err: any) {
                if (err.name === 'SequelizeUniqueConstraintError') {
                    continue;
                } else {
                    throw err;
                }
            }
        }
        ticket.quantitySold += quantity;

        // do payment logic if ticket.price > 0
        await ticket.save();
        res.status(201).json({ orders });
    } catch (error) {
        console.log('Create order error:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
};
