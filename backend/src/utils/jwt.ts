import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!

export const generateAccessToken = (userId: number): string => {
    return jwt.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
};

export const generateRefreshToken = (userId: number): string => {
    return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

export const verifyAccessToken = (token: string): { userId: number } | null => {
    try {
        return jwt.verify(token, ACCESS_TOKEN_SECRET) as { userId: number };
    } catch (error) {
        return null;
    }
};

export const verifyRefreshToken = (token: string): { userId: number } | null => {
    try {
        return jwt.verify(token, REFRESH_TOKEN_SECRET) as { userId: number };
    } catch (error) {
        return null;
    }
};
