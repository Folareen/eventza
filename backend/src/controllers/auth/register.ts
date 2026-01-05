import argon2 from "argon2";
import { Request, Response } from "express";
import { OTP_EXPIRY_MINUTES } from "../../constants/otp";
import { OtpType } from "../../models/Otp";
import User from "../../models/User";
import { sendWelcomeEmail } from "../../services/email";
import { createOtp } from "../../services/otp";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt";

export const register = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            return res.status(409).json({ error: "Email already registered" });
        }

        const hashedPassword = await argon2.hash(password);

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        await user.update({ refreshToken });

        const otp = await createOtp(user.id, OtpType.EMAIL_VERIFICATION, OTP_EXPIRY_MINUTES[OtpType.EMAIL_VERIFICATION]);

        await sendWelcomeEmail(email, otp, OTP_EXPIRY_MINUTES[OtpType.EMAIL_VERIFICATION]);

        res.status(201).json({
            message: "User registered successfully. Please check your email to verify your account.",
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                emailVerified: user.emailVerified
            }
        });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ error: "Registration failed" });
    }
};
