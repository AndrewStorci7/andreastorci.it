import { NextResponse, type NextRequest } from 'next/server';
import { verifyAuthToken } from '@lib/auth';

// Endpoint che richiedono autenticazione
const PROTECTED_PATHS = [
    '/api/update',
    '/api/delete',
    '/api/translate',
];

// Endpoint con rate limiting stringente
const RATE_LIMITED_PATHS = [
    '/api/translate',
    '/api/news',
];

// Rate limiting storage
const rateLimitStore = new Map<string, { count: number; reset: number }>();

function checkRateLimit(
    key: string,
    maxRequests: number = 10,
    windowMs: number = 60000
): boolean {
    const now = Date.now();
    const limit = rateLimitStore.get(key);

    if (!limit || now > limit.reset) {
        rateLimitStore.set(key, {
            count: 1,
            reset: now + windowMs,
        });
        return true;
    }

    if (limit.count >= maxRequests) {
        return false;
    }

    limit.count++;
    return true;
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isProtected = PROTECTED_PATHS.some((path) =>
        pathname.startsWith(path)
    );

    if (isProtected) {
        const token = request.cookies.get('auth_token')?.value;

        if (!token) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        const payload = await verifyAuthToken(token);

        if (!payload) {
            return NextResponse.json(
                { error: 'Invalid or expired token' },
                { status: 401 }
            );
        }

        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('x-user-id', payload.userId);
        requestHeaders.set('x-username', payload.username);

        const response = NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });

        return response;
    }

    const isRateLimited = RATE_LIMITED_PATHS.some((path) =>
        pathname.startsWith(path)
    );

    if (isRateLimited) {
        const ip =
            request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
        const rateLimitKey = `${pathname}:${ip}`;

        // Limiti specifici per endpoint
        let maxRequests = 30;
        let windowMs = 60000; // 1 minuto

        if (pathname.startsWith('/api/translate')) {
            maxRequests = 10;
        }

        if (!checkRateLimit(rateLimitKey, maxRequests, windowMs)) {
            return NextResponse.json(
                {
                    error: 'Rate limit exceeded',
                    message: `Maximum ${maxRequests} requests per minute`,
                },
                {
                    status: 429,
                    headers: {
                        'Retry-After': '60',
                    },
                }
            );
        }
    }

    const response = NextResponse.next();

    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set(
        'Referrer-Policy',
        'strict-origin-when-cross-origin'
    );
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

    response.headers.set(
        'Content-Security-Policy',
        "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; object-src 'none';"
    );

    if (process.env.NODE_ENV === 'production') {
        response.headers.set(
            'Strict-Transport-Security',
            'max-age=31536000; includeSubDomains'
        );
    }

    return response;
}

export const config = {
    // matcher: [
    //     '/((?!_next/static|_next/image|favicon.ico).*)',
    // ],
    matcher: [
        '/api/:path*',
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};