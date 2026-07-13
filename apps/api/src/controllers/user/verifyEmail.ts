import { Request, Response } from "express";
import { OtpType } from "../../models/Otp";
import { verifyOtp, invalidateOtps } from "../../services/otp";
import { onboardAccount } from "../../services/stripe";
import sequelize from "../../config/database";

export const verifyEmail = async (req: Request, res: Response) => {
    try {
        const { otp } = req.body;
        const user = req.user;

        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        if (user.emailVerified) {
            return res.status(400).json({ error: "Email already verified" });
        }

        // Verify OTP outside a transaction first — read-only check
        const otpVerification = await verifyOtp(user.id, otp, OtpType.EMAIL_VERIFICATION);

        if (!otpVerification.valid) {
            return res.status(400).json({ error: "Invalid or expired OTP" });
        }

        // Stripe call happens BEFORE opening the DB transaction
        let stripeAccount;
        try {
            stripeAccount = await onboardAccount({ email: user.email, name: `${user.firstName} ${user.lastName}` });
        } catch (stripeError) {
            console.error("Stripe account creation failed:", stripeError);
            return res.status(500).json({ error: "Failed to create payment account. Please try again." });
        }

        // Now the transaction only does fast writes
        const transaction = await sequelize.transaction();
        try {
            await user.update({ emailVerified: true, stripeAccountId: stripeAccount.id }, { transaction });
            await invalidateOtps(user.id, OtpType.EMAIL_VERIFICATION, transaction);
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw err;
        }

        res.json({ message: "Email verified successfully" });
    } catch (error) {
        console.error("Error verifying email:", error);
        res.status(500).json({ error: "Email verification failed" });
    }
};