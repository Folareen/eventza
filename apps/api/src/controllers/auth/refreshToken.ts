import { Request, Response } from "express";
import User from "../../models/User";
import { generateUserAccessToken, generateUserRefreshToken, verifyUserRefreshToken } from "../../utils/jwt";

export const refreshToken = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;

        const payload = verifyUserRefreshToken(refreshToken);

        if (!payload) {
            return res.status(401).json({ error: "Invalid or expired refresh token" });
        }

        const user = await User.findByPk(payload.userId);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({ error: "Invalid refresh token" });
        }

        const newAccessToken = generateUserAccessToken(user.id);
        const newRefreshToken = generateUserRefreshToken(user.id);

        await user.update({ refreshToken: newRefreshToken });

        res.json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });
    } catch (error) {
        console.error("Error refreshing token:", error);
        res.status(500).json({ error: "Token refresh failed" });
    }
};
