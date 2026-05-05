import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import https from 'https';
import http from 'http';
import sequelize from './src/config/database';
import './src/middleware/authenticate/index';
import { notFound } from './src/middleware/notFound';
import './src/models/index';
import authRoutes from './src/routes/auth';
import eventRoutes from './src/routes/event';
import scannerRoutes from './src/routes/scanner';
import userRoutes from './src/routes/user';
import { stripeWebhook } from './src/controllers/order/stripeWebhook';

const app = express();

app.use(cors({ origin: [process.env.FRONTEND_URL || 'http://localhost:3000', process.env.SCANNER_URL || 'http://localhost:3002'] }));
app.post('/api/v1/webhooks/stripe', express.raw({ type: 'application/json' }), stripeWebhook);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/ping', (_req, res) => res.json({ ok: true }));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/scanners', scannerRoutes);
app.use(notFound)

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3001;

function keepAlive() {
    const selfUrl = process.env.SELF_URL;
    if (!selfUrl) return;

    const url = new URL('/ping', selfUrl);
    const client = url.protocol === 'https:' ? https : http;

    client.get(url.toString(), (res) => {
        console.log(`[keep-alive] ping ${res.statusCode}`);
    }).on('error', (err) => {
        console.error('[keep-alive] ping failed:', err.message);
    });
}

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection established successfully.');

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            setInterval(keepAlive, 14 * 60 * 1000);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
})();