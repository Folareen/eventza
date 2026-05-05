import { Request, Response } from 'express';
import QRCode from 'qrcode';
import { Order, Ticket, Event, User } from '../../models';
import type { OrderStatus } from '../../models/Order';
import { v4 as uuidv4 } from 'uuid';
import { sendTicketEmail } from '../../services/email';
import { createPaymentIntent } from '../../services/stripe';

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

        const event = await Event.findByPk(ticket.eventId);

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

        // Only increment quantitySold immediately for free tickets.
        // For paid tickets it is incremented by the webhook on payment_intent.succeeded.
        if (ticket.price === 0) {
            ticket.quantitySold += quantity;
            await ticket.save();
        }

        if (ticket.price === 0) {
            if (event) {
                const eventDate = new Date(event.date).toLocaleDateString('en-US', {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                });
                Promise.allSettled(
                    orders.map(async (order) => {
                        const qrCodeBuffer = await QRCode.toBuffer(order.code, {
                            type: 'png',
                            width: 400,
                            margin: 2,
                            color: { dark: '#111827', light: '#ffffff' },
                        });
                        await sendTicketEmail({
                            to: email,
                            recipientName: name,
                            eventTitle: event.title,
                            eventDate,
                            eventVenue: `${event.venue}, ${event.state}`,
                            ticketName: ticket.name,
                            orderCode: order.code,
                            qrCodeBuffer,
                        });
                    })
                ).catch((err) => console.error('Ticket email error:', err));
            }
            return res.status(201).json({ orders });
        }

        const organizer = await User.findByPk(event!.organizerId);
        if (!organizer?.stripeAccountId) {
            return res.status(400).json({ error: 'Organizer has not completed payment setup' });
        }

        const totalAmount = Math.round(Number(ticket.price) * quantity * 100);
        const applicationFeeAmount = Math.round(totalAmount * 0.05);

        const paymentIntent = await createPaymentIntent({
            amount: totalAmount,
            currency: 'usd',
            applicationFeeAmount,
            destinationAccountId: organizer.stripeAccountId,
            metadata: {
                orderIds: orders.map((o) => o.id).join(','),
            },
        });

        await Order.update(
            { stripePaymentIntentId: paymentIntent.id },
            { where: { id: orders.map((o) => o.id) } }
        );

        res.status(201).json({ clientSecret: paymentIntent.client_secret, orders });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create order' });
    }
};
