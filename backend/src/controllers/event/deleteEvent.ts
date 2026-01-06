import { Request, Response } from 'express';
import Event from '../../models/Event';

export const deleteEvent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const event = await Event.findOne({ where: { id, organizerId: req.user!.id } });

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        await event.destroy();

        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Delete event error:', error);
        res.status(500).json({ error: 'Failed to delete event' });
    }
};
