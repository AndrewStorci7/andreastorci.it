import { NextResponse } from "next/server";
import { clearAuthCookie } from "@lib/auth";

export async function POST() {
    try {
        await clearAuthCookie();

        return NextResponse.json({ success: true });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
    }
}