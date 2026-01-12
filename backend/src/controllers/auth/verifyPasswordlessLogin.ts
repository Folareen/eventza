import { Request, Response } from "express";
import { OtpType } from "../../models/Otp";
import User from "../../models/User";
import { verifyOtp } from "../../services/otp";
import { generateUserAccessToken, generateUserRefreshToken } from "../../utils/jwt";

export const verifyPasswordlessLogin = async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ error: "Invalid or expired OTP" });
        }

        const otpVerification = await verifyOtp(user.id, otp, OtpType.PASSWORDLESS_LOGIN);

        if (!otpVerification.valid) {
            return res.status(400).json({ error: "Invalid or expired OTP" });
        }

        const accessToken = generateUserAccessToken(user.id);
        const refreshToken = generateUserRefreshToken(user.id);

        await user.update({ refreshToken });

        res.json({
            message: "Login successful",
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Error verifying passwordless login:", error);
        res.status(500).json({ error: "Passwordless login verification failed" });
    }
};
