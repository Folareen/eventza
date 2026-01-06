import { Request, Response } from 'express';
import Event from '../../models/Event';

export const updateEvent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, description, date, time, venue, capacity, bannerImage } = req.body;

        const event = await Event.findOne({ where: { id, organizerId: req.user!.id } });

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        const updateData: any = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (date) updateData.date = new Date(date);
        if (time) updateData.time = time;
        if (venue) updateData.venue = venue;
        if (capacity) updateData.capacity = capacity;
        if (bannerImage) updateData.bannerImage = bannerImage;

        await event.update(updateData);

        res.status(200).json({
            message: 'Event updated successfully',
            event,
        });
    } catch (error: any) {
        console.error('Update event error:', error);
        res.status(500).json({ error: 'Failed to update event' });
    }
};
