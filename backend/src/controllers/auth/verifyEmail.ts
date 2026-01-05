import { Request, Response } from "express";
import { OtpType } from "../../models/Otp";
import { verifyOtp } from "../../services/otp";

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

        const otpVerification = await verifyOtp(user.id, otp, OtpType.EMAIL_VERIFICATION);

        if (!otpVerification.valid) {
            return res.status(400).json({ error: "Invalid or expired OTP" });
        }

        await user.update({ emailVerified: true });

        res.json({ message: "Email verified successfully" });
    } catch (error) {
        console.error("Error verifying email:", error);
        res.status(500).json({ error: "Email verification failed" });
    }
};
