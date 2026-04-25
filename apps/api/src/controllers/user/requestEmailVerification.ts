import { Request, Response } from "express";
import { OTP_EXPIRY_MINUTES } from "../../constants/otp";
import { OtpType } from "../../models/Otp";
import { sendOtpEmail } from "../../services/email";
import { createOtp, invalidateOtps } from "../../services/otp";

export const requestEmailVerification = async (req: Request, res: Response) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        if (user.emailVerified) {
            return res.status(400).json({ error: "Email already verified" });
        }

        await invalidateOtps(user.id, OtpType.EMAIL_VERIFICATION);

        const otp = await createOtp(user.id, OtpType.EMAIL_VERIFICATION, OTP_EXPIRY_MINUTES[OtpType.EMAIL_VERIFICATION]);

        await sendOtpEmail(user.email, otp, OtpType.EMAIL_VERIFICATION, OTP_EXPIRY_MINUTES[OtpType.EMAIL_VERIFICATION]);

        res.json({ message: "Verification OTP sent to your email" });
    } catch (error) {
        console.error("Error requesting email verification:", error);
        res.status(500).json({ error: "Email verification request failed" });
    }
};
