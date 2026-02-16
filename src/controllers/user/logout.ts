import { Request, Response } from "express";
import { verifyUserRefreshToken } from "../../utils/jwt";

export const logout = async (req: Request, res: Response) => {
    try {
        const user = req.user!;
        console.log(user, 'see this')
        if (!user || !user.refreshToken) {
            return res.status(401).json({ error: "User not authenticated" });
        }
        const payload = verifyUserRefreshToken(user.refreshToken);

        if (!payload) {
            return res.status(401).json({ error: "Invalid or expiredrefresh token" });
        }

        await user.update({ refreshToken: null });

        res.json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({ error: "Logout failed" });
    }
};
