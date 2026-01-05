import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import { verifyAccessToken } from "../utils/jwt";

declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Access token required" });
        }

        const token = authHeader.substring(7);

        const payload = verifyAccessToken(token);

        if (!payload) {
            return res.status(401).json({ error: "Invalid or expired access token" });
        }

        const user = await User.findByPk(payload.userId, {
            attributes: { exclude: ['password', 'refreshToken'] }
        });

        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        req.user = user;

        next();
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(401).json({ error: "Authentication failed" });
    }
};
