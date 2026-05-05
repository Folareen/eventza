import { Request, Response } from 'express';
import stripe from '../../config/stripe';

export const getStripeStatus = async (req: Request, res: Response) => {
    try {
        const user = req.user!;

        if (!user.stripeAccountId) {
            return res.json({ detailsSubmitted: false });
        }

        const account = await stripe.accounts.retrieve(user.stripeAccountId);
        res.json({ detailsSubmitted: account.details_submitted });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch Stripe status' });
    }
};
