import { verifyAuthToken, getAuthCookie } from '@lib/auth';
import { NextResponse } from 'next/server';

export async function POST() {
    try {
        const token = await getAuthCookie();

        if (!token) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const payload = await verifyAuthToken(token);
        // console.log(payload)

        if (!payload) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        return NextResponse.json({
            // success: true,
            user: {
                id: payload.userId,
                username: payload.username,
                name: payload.fullName
            },
        });
    } catch (error) {
        return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
    }
}