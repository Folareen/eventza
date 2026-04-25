import { Request, Response } from "express";
import { OTP_EXPIRY_MINUTES } from "../../constants/otp";
import { OtpType } from "../../models/Otp";
import User from "../../models/User";
import { sendOtpEmail } from "../../services/email";
import { createOtp, invalidateOtps } from "../../services/otp";

export const requestPasswordlessLogin = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.json({ message: "If the email exists, an OTP will be sent" });
        }

        await invalidateOtps(user.id, OtpType.PASSWORDLESS_LOGIN);

        const otp = await createOtp(user.id, OtpType.PASSWORDLESS_LOGIN, OTP_EXPIRY_MINUTES[OtpType.PASSWORDLESS_LOGIN]);

        await sendOtpEmail(email, otp, OtpType.PASSWORDLESS_LOGIN, OTP_EXPIRY_MINUTES[OtpType.PASSWORDLESS_LOGIN]);

        res.json({ message: "If the email exists, an OTP will be sent" });
    } catch (error) {
        console.error("Error requesting passwordless login:", error);
        res.status(500).json({ error: "Passwordless login request failed" });
    }
};
