import argon2 from "argon2";
import { Request, Response } from "express";
import User from "../../models/User";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt";

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });

        if (!user || !user.password) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const isValidPassword = await argon2.verify(user.password, password);

        if (!isValidPassword) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

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
        console.error("Error during login:", error);
        res.status(500).json({ error: "Login failed" });
    }
}; 