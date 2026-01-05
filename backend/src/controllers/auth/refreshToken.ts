import { Request, Response } from "express";
import User from "../../models/User";
import { generateAccessToken, verifyRefreshToken } from "../../utils/jwt";

export const refreshToken = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;

        const payload = verifyRefreshToken(refreshToken);

        if (!payload) {
            return res.status(401).json({ error: "Invalid or expired refresh token" });
        }

        const user = await User.findByPk(payload.userId);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({ error: "Invalid refresh token" });
        }

        const newAccessToken = generateAccessToken(user.id);

        res.json({
            accessToken: newAccessToken
        });
    } catch (error) {
        console.error("Error refreshing token:", error);
        res.status(500).json({ error: "Token refresh failed" });
    }
};
