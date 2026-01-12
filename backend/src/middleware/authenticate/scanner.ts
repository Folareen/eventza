import { NextFunction, Request, Response } from "express";
import Scanner from "../../models/Scanner";
import jwt from "jsonwebtoken";
import { verifyScannerAccessToken } from "../../utils/jwt";

declare global {
    namespace Express {
        interface Request {
            scanner?: Scanner;
        }
    }
}

export const authenticateScanner = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Access token required" });
        }

        const token = authHeader.substring(7);

        const payload = verifyScannerAccessToken(token);

        if (!payload) {
            return res.status(401).json({ error: "Invalid or expired access token" });
        }

        const scanner = await Scanner.findByPk(payload.scannerId, {
            attributes: { exclude: ['password'] }
        });

        if (!scanner) {
            return res.status(401).json({ error: "Scanner not found" });
        }

        req.scanner = scanner;

        next();
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
};
