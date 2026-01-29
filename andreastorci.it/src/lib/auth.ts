import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { cookies } from 'next/headers';

const TOKEN_SECRET = new TextEncoder().encode(
    process.env.TOKEN_SECRET
);

export interface AppJWTPayload extends JWTPayload {
    userId: string;
    fullName: string;
    username: string;
    ip: string;
    // iat: number;
    // exp: number;
}

export async function generateAuthToken(
    userId: string,
    fullName: string,
    username: string,
    ip: string
): Promise<string> {
    const token = await new SignJWT({
        userId,
        fullName,
        username,
        ip,
    })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(TOKEN_SECRET);

    return token;
}

export async function verifyAuthToken(token: string): Promise<AppJWTPayload | null> {
    try {
        const { payload } = await jwtVerify(token, TOKEN_SECRET);
        return payload as AppJWTPayload;
    } catch (error) {
        console.error('Token verification failed:', error);
        return null;
    }
}

export async function setAuthCookie(token: string) {
    (await cookies()).set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24 ore
        path: '/',
    });
}

export async function getAuthCookie(): Promise<string | null> {
    const cookie = (await cookies()).get('auth_token');
    return cookie?.value || null;
}

export async function clearAuthCookie() {
    (await cookies()).delete('auth_token');
}