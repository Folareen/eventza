import jwt from 'jsonwebtoken';

const USER_ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!
const USER_REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!
const SCANNER_ACCESS_TOKEN_SECRET = process.env.SCANNER_TOKEN_SECRET!

export const generateUserAccessToken = (userId: number): string => {
    return jwt.sign({ userId }, USER_ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
};
export const generateScannerAccessToken = (scannerId: number): string => {
    return jwt.sign({ scannerId }, SCANNER_ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
};

export const generateUserRefreshToken = (userId: number): string => {
    return jwt.sign({ userId }, USER_REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

export const verifyUserAccessToken = (token: string): { userId: number } | null => {
    try {
        return jwt.verify(token, USER_ACCESS_TOKEN_SECRET) as { userId: number };
    } catch (error) {
        return null;
    }
};
export const verifyScannerAccessToken = (token: string): { scannerId: number } | null => {
    try {
        return jwt.verify(token, SCANNER_ACCESS_TOKEN_SECRET) as { scannerId: number };
    } catch (error) {
        return null;
    }
}

export const verifyUserRefreshToken = (token: string): { userId: number } | null => {
    try {
        return jwt.verify(token, USER_REFRESH_TOKEN_SECRET) as { userId: number };
    } catch (error) {
        return null;
    }
};
