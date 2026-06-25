import { Request, Response } from 'express';
import Event from '../../models/Event';
import { uploadToCloudinary } from '../../services/cloudinary';

type MulterRequestWithFile = Request & { file?: Express.Multer.File };

export const updateEvent = async (req: Request, res: Response) => {
    try {
        const { eventId } = req.params;
        const { title, description, date, time, venue, capacity } = req.body;
        const event = await Event.findOne({ where: { id: eventId, organizerId: req.user!.id } });
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
        const reqWithFile = req as MulterRequestWithFile;
        if (reqWithFile.file) {
            updateData.bannerImage = await uploadToCloudinary(reqWithFile.file);
        }
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
