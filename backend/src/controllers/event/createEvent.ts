import { Request, Response } from 'express';
import Event from '../../models/Event';

export const createEvent = async (req: Request, res: Response) => {
    try {
        const { title, description, date, time, venue, capacity, bannerImage } = req.body;

        const event = await Event.create({
            title,
            description,
            date: new Date(date),
            time,
            venue,
            capacity,
            ...(bannerImage && { bannerImage }),
            organizerId: req.user!.id,
        });

        res.status(201).json({
            message: 'Event created successfully',
            event,
        });
    } catch (error: any) {
        console.error('Create event error:', error);
        res.status(500).json({ error: 'Failed to create event' });
    }
};
