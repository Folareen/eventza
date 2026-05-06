import { Request, Response } from 'express';
import Stripe from 'stripe';
import QRCode from 'qrcode';
import stripeClient from '../../config/stripe';
import { Order, Ticket, Event } from '../../models';
import { sendTicketEmail } from '../../services/email';

export const stripeWebhook = async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'] as string;

    let event: Stripe.Event;
    try {
        event = stripeClient.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        return res.status(400).json({ error: `Webhook Error: ${err.message}` });
    }

    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        const orders = await Order.findAll({
            where: { stripePaymentIntentId: paymentIntent.id },
        });

        if (!orders.length) return res.json({ received: true });

        if (orders.every((o) => o.status === 'confirmed')) {
            return res.json({ received: true });
        }

        await Order.update(
            { status: 'confirmed' },
            { where: { stripePaymentIntentId: paymentIntent.id } }
        );

        const ticket = await Ticket.findByPk(orders[0].ticketId);

        if (ticket) {
            ticket.quantitySold += orders.length;
            await ticket.save();
        }

        const dbEvent = ticket ? await Event.findByPk(ticket.eventId) : null;

        if (dbEvent && ticket) {
            const eventDate = new Date(dbEvent.date).toLocaleDateString('en-US', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            });

            const results = await Promise.allSettled(
                orders.map(async (order) => {
                    const qrCodeBuffer = await QRCode.toBuffer(order.code, {
                        type: 'png',
                        width: 400,
                        margin: 2,
                        color: { dark: '#111827', light: '#ffffff' },
                    });
                    await sendTicketEmail({
                        to: order.email,
                        recipientName: order.name,
                        eventTitle: dbEvent.title,
                        eventDate,
                        eventVenue: `${dbEvent.venue}, ${dbEvent.state}`,
                        ticketName: ticket.name,
                        orderCode: order.code,
                        qrCodeBuffer,
                    });
                })
            );

            results.forEach((r, i) => {
                if (r.status === 'rejected') {
                    console.error(`Ticket email failed for order ${orders[i].code}:`, r.reason);
                }
            });
        }
    }

    if (event.type === 'payment_intent.payment_failed') {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        await Order.update(
            { status: 'cancelled' },
            { where: { stripePaymentIntentId: paymentIntent.id } }
        );
    }

    res.json({ received: true });
};
