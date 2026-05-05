import { Request, Response } from 'express';
import { createAccountLink } from '../../services/stripe';

export const getStripeOnboardingLink = async (req: Request, res: Response) => {
    try {
        const user = req.user!;

        if (!user.stripeAccountId) {
            return res.status(400).json({ error: 'No Stripe account found. Please verify your email first.' });
        }

        const link = await createAccountLink(
            user.stripeAccountId,
            `${process.env.FRONTEND_URL}/dashboard/onboarding/return`,
            `${process.env.FRONTEND_URL}/dashboard/onboarding/refresh`
        );

        res.json({ url: link.url });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create onboarding link' });
    }
};
