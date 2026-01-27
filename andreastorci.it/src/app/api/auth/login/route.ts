import { generateAuthToken, setAuthCookie } from '@lib/auth';
import db, { type UserTable } from "@lib/mongodb";
import { NextResponse } from 'next/server';
import crypto from 'crypto';

const collection = db.collection<UserTable>("users");

// Rate limiting map
const loginAttempts = new Map<string, { count: number; resetTime: number }>();

const hashSHA256 = (data: string): string => {
    return crypto.createHash('sha256').update(data).digest('hex');
};

const checkRateLimit = (ip: string): { allowed: boolean; retryAfter?: number } => {
    const now = Date.now();
    const attempt = loginAttempts.get(ip);

    if (!attempt || now > attempt.resetTime) {
        loginAttempts.set(ip, {
            count: 1,
            resetTime: now + 15 * 60 * 1000, // 15 minuti
        });
        return { allowed: true };
    }

    if (attempt.count >= 5) {
        const retryAfter = Math.ceil((attempt.resetTime - now) / 1000);
        return { allowed: false, retryAfter };
    }

    attempt.count++;
    return { allowed: true };
};

export async function POST(req: Request) {
    try {
        const forwardedFor = req.headers.get('x-forwarded-for');
        const ip = forwardedFor?.split(',')[0]?.trim() || 'unknown';

        const { username, password } = await req.json();

        // Validazione input
        if (
            !username ||
            !password ||
            typeof username !== 'string' ||
            typeof password !== 'string'
        ) {
            return NextResponse.json(
                { error: 'Invalid credentials format' },
                { status: 400 }
            );
        }

        // Rate limiting
        const rateLimit = checkRateLimit(ip);
        if (!rateLimit.allowed) {
            return NextResponse.json(
                {
                    error: 'Too many login attempts',
                    retryAfter: rateLimit.retryAfter,
                },
                {
                    status: 429,
                    headers: {
                        'Retry-After': rateLimit.retryAfter?.toString() || '900',
                    },
                }
            );
        }

        // Hash e verifica credenziali
        const hashedUsername = hashSHA256(username);
        const hashedPassword = hashSHA256(password);
        // console.log(hashedUsername, hashedPassword)

        const user = await collection.findOne({ username: hashedUsername });

        if (!user || user.password !== hashedPassword) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Genera token JWT
        const token = await generateAuthToken(
            user._id.toString(),
            username,
            ip
        );

        // Imposta cookie sicuro
        await setAuthCookie(token);

        return NextResponse.json({
            success: true,
            user: {
                id: user._id.toString(),
                username: user.name,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}