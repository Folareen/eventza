import { Request, Response } from "express";
import { OTP_EXPIRY_MINUTES } from "../../constants/otp";
import { OtpType } from "../../models/Otp";
import User from "../../models/User";
import { sendOtpEmail } from "../../services/email";
import { createOtp, invalidateOtps } from "../../services/otp";

export const requestPasswordReset = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.json({ message: "If the email exists, an OTP will be sent" });
        }

        await invalidateOtps(user.id, OtpType.PASSWORD_RESET);

        const otp = await createOtp(user.id, OtpType.PASSWORD_RESET, OTP_EXPIRY_MINUTES[OtpType.PASSWORD_RESET]);

        await sendOtpEmail(email, otp, OtpType.PASSWORD_RESET, OTP_EXPIRY_MINUTES[OtpType.PASSWORD_RESET]);

        res.json({ message: "If the email exists, an OTP will be sent" });
    } catch (error) {
        console.error("Error requesting password reset:", error);
        res.status(500).json({ error: "Password reset request failed" });
    }
};
