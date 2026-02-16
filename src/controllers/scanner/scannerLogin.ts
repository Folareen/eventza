import { Request, Response } from 'express';
import argon2 from 'argon2';
import { Event, Scanner } from '../../models';
import { generateScannerAccessToken } from '../../utils/jwt';

export const scannerLogin = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        const scanner = await Scanner.findOne({ where: { username }, include: ['events'] });

        if (!scanner || !scanner.password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const valid = await argon2.verify(scanner.password, password);

        if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

        const token = generateScannerAccessToken(scanner.id);

        res.json({ token, scanner: { id: scanner.id, username: scanner.username, eventIds: scanner.events?.map((e: Event) => e.id) } });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
};