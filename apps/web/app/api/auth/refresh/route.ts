import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API = process.env.API_URL ?? 'http://localhost:3001/api/v1';

const COOKIE_OPTS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/',
};

export async function POST(_req: NextRequest) {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;

    if (!refreshToken) {
        return NextResponse.json({ error: 'No session' }, { status: 401 });
    }

    const res = await fetch(`${API}/auth/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
    });

    const data = await res.json();

    if (!res.ok) {
        const response = NextResponse.json({ error: 'Session expired' }, { status: 401 });
        response.cookies.delete('refresh_token');
        return response;
    }

    const { accessToken, refreshToken: newRefreshToken } = data;

    // Fetch the user with the new token
    const userRes = await fetch(`${API}/users/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!userRes.ok) {
        const response = NextResponse.json({ error: 'Session expired' }, { status: 401 });
        response.cookies.delete('refresh_token');
        return response;
    }

    const userData = await userRes.json();

    const response = NextResponse.json({ accessToken, user: userData.user });
    if (newRefreshToken) {
        response.cookies.set('refresh_token', newRefreshToken, {
            ...COOKIE_OPTS,
            maxAge: 60 * 60 * 24 * 7,
        });
    }
    return response;
}
