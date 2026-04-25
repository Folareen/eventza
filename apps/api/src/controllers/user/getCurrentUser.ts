import { Request, Response } from "express";

export const getCurrentUser = async (req: Request, res: Response) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        res.json({ user });
    } catch (error) {
        console.error("Error fetching current user:", error);
        res.status(500).json({ error: "Failed to fetch user" });
    }
};
