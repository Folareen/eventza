import { Request, Response } from "express";
import { OtpType } from "../../models/Otp";
import { verifyOtp, invalidateOtps } from "../../services/otp";
import { onboardAccount } from "../../services/stripe";
import sequelize from "../../config/database";

export const verifyEmail = async (req: Request, res: Response) => {
    let transaction: any;

    try {
        const { otp } = req.body;
        const user = req.user;

        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        if (user.emailVerified) {
            return res.status(400).json({ error: "Email already verified" });
        }

        transaction = await sequelize.transaction();

        const otpVerification = await verifyOtp(user.id, otp, OtpType.EMAIL_VERIFICATION, transaction);

        if (!otpVerification.valid) {
            await transaction.rollback();
            return res.status(400).json({ error: "Invalid or expired OTP" });
        }

        let stripeAccount;
        try {
            stripeAccount = await onboardAccount({ email: user.email, name: `${user.firstName} ${user.lastName}` });
        } catch (stripeError) {
            await transaction.rollback();
            console.error("Stripe account creation failed:", stripeError);
            return res.status(500).json({ error: "Failed to create payment account. Please try again." });
        }

        await user.update({ emailVerified: true, stripeAccountId: stripeAccount.id }, { transaction });

        await invalidateOtps(user.id, OtpType.EMAIL_VERIFICATION);

        await transaction.commit();

        res.json({ message: "Email verified successfully" });
    } catch (error) {
        console.error("Error verifying email:", error);
        if (transaction) await transaction.rollback().catch(() => { });
        res.status(500).json({ error: "Email verification failed" });
    }
};
