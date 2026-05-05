import { Request, Response } from 'express';
import { createLoginLink } from '../../services/stripe';

export const getStripeDashboardLink = async (req: Request, res: Response) => {
    try {
        const user = req.user!;

        if (!user.stripeAccountId) {
            return res.status(400).json({ error: 'No Stripe account found.' });
        }

        const link = await createLoginLink(user.stripeAccountId);

        res.json({ url: link.url });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create dashboard link' });
    }
};
