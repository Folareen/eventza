import { Request, Response } from 'express';
import { eventListQuerySchema } from '../../validators/eventListQuery';
import { Event } from '../../models';
import { Op, WhereOptions } from 'sequelize';

export const getAllEvents = async (req: Request, res: Response) => {
    try {
        const { country, state, category, date, search, sort = 'date', order = 'asc', page, limit } = req.query;
        const pageNum = parseInt(page as string, 10) || 1;
        const limitNum = parseInt(limit as string, 10) || 20;
        const offset = (pageNum - 1) * limitNum;

        const where: WhereOptions = {};
        if (country) where.country = country;
        if (state) where.state = state;
        if (category) where.category = category;
        if (date) where.date = date;
        if (search) {
            (where as any)[Op.or] = [
                { title: { [Op.iLike]: `%${search}%` } },
                { description: { [Op.iLike]: `%${search}%` } }
            ];
        }

        const { rows, count } = await Event.findAndCountAll({
            where,
            order: [[sort as string, order as string]],
            limit: limitNum,
            offset,
        });

        res.json({
            events: rows,
            pagination: {
                total: count,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(count / limitNum)
            }
        });
    } catch (error) {
        console.error('Get all events error:', error);
        res.status(500).json({ error: 'Failed to get all events' });
    }

};
