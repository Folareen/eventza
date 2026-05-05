import { Request, Response } from 'express';
import { Event, Ticket, Order } from '../../models';

export const getEventAnalytics = async (req: Request, res: Response) => {
    try {
        const { eventId } = req.params;

        const event = await Event.findOne({
            where: { id: eventId, organizerId: req.user!.id },
        });
        if (!event) return res.status(404).json({ error: 'Event not found' });

        const tickets = await Ticket.findAll({ where: { eventId } });
        const ticketIds = tickets.map((t) => t.id);

        const orders = ticketIds.length
            ? await Order.findAll({ where: { ticketId: ticketIds } })
            : [];

        const confirmedOrders = orders.filter((o) => o.status === 'confirmed');

        const totalTicketsSold = confirmedOrders.length;
        const totalRevenue = confirmedOrders.reduce((sum, o) => sum + Number(o.amount), 0);
        const totalCheckIns = confirmedOrders.filter((o) => o.checkedIn).length;
        const capacityUsed = event.capacity > 0
            ? Math.round((totalTicketsSold / event.capacity) * 100)
            : 0;

        const ticketBreakdown = tickets.map((t) => {
            const ticketOrders = confirmedOrders.filter((o) => o.ticketId === t.id);
            return {
                id: t.id,
                name: t.name,
                sold: ticketOrders.length,
                available: t.quantityAvailable,
                revenue: ticketOrders.reduce((sum, o) => sum + Number(o.amount), 0),
                price: Number(t.price),
            };
        });

        const revenueByDayMap: Record<string, { revenue: number; orders: number }> = {};
        confirmedOrders.forEach((o) => {
            const date = new Date(o.createdAt).toISOString().split('T')[0];
            if (!revenueByDayMap[date]) revenueByDayMap[date] = { revenue: 0, orders: 0 };
            revenueByDayMap[date].revenue += Number(o.amount);
            revenueByDayMap[date].orders += 1;
        });
        const revenueByDay = Object.entries(revenueByDayMap)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([date, data]) => ({ date, ...data }));

        const ordersByStatus = {
            confirmed: orders.filter((o) => o.status === 'confirmed').length,
            pending: orders.filter((o) => o.status === 'pending').length,
            cancelled: orders.filter((o) => o.status === 'cancelled').length,
        };

        res.json({
            totalTicketsSold,
            totalRevenue,
            totalCheckIns,
            capacityUsed,
            ticketBreakdown,
            revenueByDay,
            ordersByStatus,
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get analytics' });
    }
};
