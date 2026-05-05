import { NextRequest, NextResponse } from 'next/server';

const API = process.env.API_URL ?? 'http://localhost:3001/api/v1';

export async function POST(req: NextRequest) {
    const body = await req.json();
    let res: Response;
    try {
        res = await fetch(`${API}/auth/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
    } catch {
        return NextResponse.json({ error: 'Could not reach server, try again later' }, { status: 503 });
    }
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}
