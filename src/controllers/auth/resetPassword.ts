import argon2 from "argon2";
import { Request, Response } from "express";
import { OtpType } from "../../models/Otp";
import User from "../../models/User";
import { verifyOtp } from "../../services/otp";

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { email, otp, newPassword } = req.body;

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ error: "Invalid or expired OTP" });
        }

        const otpVerification = await verifyOtp(user.id, otp, OtpType.PASSWORD_RESET);

        if (!otpVerification.valid) {
            return res.status(400).json({ error: "Invalid or expired OTP" });
        }

        const hashedPassword = await argon2.hash(newPassword);

        await user.update({ password: hashedPassword });

        res.json({ message: "Password reset successful" });
    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ error: "Password reset failed" });
    }
};
