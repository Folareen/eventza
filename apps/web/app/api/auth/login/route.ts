import { NextRequest, NextResponse } from 'next/server';

const API = process.env.API_URL ?? 'http://localhost:3001/api/v1';

const COOKIE_OPTS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
};

async function forwardAuth(expressRes: Response): Promise<NextResponse> {
    const data = await expressRes.json();
    if (!expressRes.ok) return NextResponse.json(data, { status: expressRes.status });

    const { user, accessToken, refreshToken } = data;
    const response = NextResponse.json({ user, accessToken });
    response.cookies.set('refresh_token', refreshToken, {
        ...COOKIE_OPTS,
        maxAge: 60 * 60 * 24 * 7,
    });
    return response;
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    let res: Response;
    try {
        res = await fetch(`${API}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
    } catch {
        return NextResponse.json({ error: 'Could not reach server, try again later' }, { status: 503 });
    }
    return forwardAuth(res);
}
