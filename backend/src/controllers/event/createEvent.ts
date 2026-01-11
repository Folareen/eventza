import { Request, Response } from 'express';
import Event from '../../models/Event';
import { uploadToS3 } from '../../services/s3';
type MulterRequestWithFile = Request & { file?: Express.Multer.File };

export const createEvent = async (req: Request, res: Response) => {
    try {
        const { title, description, date, time, venue, capacity } = req.body;
        let bannerImageUrl = req.body.bannerImage;
        const reqWithFile = req as MulterRequestWithFile;
        if (reqWithFile.file) {
            bannerImageUrl = await uploadToS3(reqWithFile.file);
        }
        const event = await Event.create({
            title,
            description,
            date: new Date(date),
            time,
            venue,
            capacity,
            ...(bannerImageUrl && { bannerImage: bannerImageUrl }),
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
