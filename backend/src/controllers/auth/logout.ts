import { Request, Response } from "express";
import User from "../../models/User";
import { verifyUserRefreshToken } from "../../utils/jwt";

export const logout = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;

        const payload = verifyUserRefreshToken(refreshToken);

        if (!payload) {
            return res.status(401).json({ error: "Invalid or expired refresh token" });
        }

        const user = await User.findByPk(payload.userId);

        if (!user) {
            return res.status(401).json({ error: "Invalid refresh token" });
        }

        await user.update({ refreshToken: null });

        res.json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({ error: "Logout failed" });
    }
};
