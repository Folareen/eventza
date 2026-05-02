import { NextRequest, NextResponse } from 'next/server';

const API = process.env.API_URL ?? 'http://localhost:3001/api/v1';

const COOKIE_OPTS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/',
};

export async function POST(req: NextRequest) {
    const body = await req.json();
    const res = await fetch(`${API}/auth/verify-passwordless-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) return NextResponse.json(data, { status: res.status });

    const { user, accessToken, refreshToken } = data;
    const response = NextResponse.json({ user, accessToken });
    response.cookies.set('refresh_token', refreshToken, {
        ...COOKIE_OPTS,
        maxAge: 60 * 60 * 24 * 7,
    });
    return response;
}
