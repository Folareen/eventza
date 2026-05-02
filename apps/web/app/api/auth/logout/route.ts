import { NextRequest, NextResponse } from 'next/server';

const API = process.env.API_URL ?? 'http://localhost:3001/api/v1';

export async function POST(req: NextRequest) {
    const authHeader = req.headers.get('authorization');
    if (authHeader) {
        await fetch(`${API}/users/logout`, {
            method: 'POST',
            headers: { Authorization: authHeader },
        }).catch(() => { });
    }
    const response = NextResponse.json({ message: 'Logged out' });
    response.cookies.delete('refresh_token');
    return response;
}
