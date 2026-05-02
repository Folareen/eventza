import { NextRequest, NextResponse } from 'next/server';

const protectedPaths = ['/dashboard', '/account'];

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

    if (isProtected && !request.cookies.has('refresh_token')) {
        const url = new URL('/auth/login', request.url);
        url.searchParams.set('from', pathname);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/account/:path*'],
};
