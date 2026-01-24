import db, { type UserTable } from "@lib/mongodb"; 
import { NextResponse } from "next/server";
import crypto from 'crypto';

const secret = process.env.TOKEN_SECRET;
const collection = db.collection<UserTable>("users");

interface LoginProps {
    type: 'check' | 'login'
    username: string,
    password?: string
    token?: string
}

const hashSHA256 = (data: string): string => {
    return crypto.createHash('sha256').update(data).digest('hex');
}

const validateCredential = async (username: string, password: string) => {
    const data = await collection.findOne({ username });

    if (data) {
        return password == data.password;
    }

    return false;
}

const generateToken = (ip: string) => {
    if (!ip) {
        throw new Error("IP non valido")
    }

    const token = crypto
        .createHmac('sha256', secret!)
        .update(ip)
        .digest('hex');
    
    return token
}

const validateToken = (ip: string, token: string) => {
    if (!ip || !token) {
        throw new Error("IP o Token non validi")
    }

    const isValid = token === crypto
        .createHmac('sha256', secret!)
        .update(ip)
        .digest('hex');
    
    return isValid
}

export async function POST(req: Request) {
    try {
        const forwardedFor = req.headers.get('x-forwarded-for');
        const ip = forwardedFor
                ? forwardedFor.split(',')[0]?.trim()
                : 'IP non disponibile';

        const data: LoginProps = await req.json();
        if (!data) {
            return NextResponse.json({ error: 'Dati non validi' }, { status: 400 });
        }

        if (data.type === 'check') {
            const check = validateToken(ip, data.token!)
            return NextResponse.json({ success: check })
        } else {
            const hashedUsername = hashSHA256(data.username);
            const hashedPassword = hashSHA256(data.password!);
            const check = await validateCredential(hashedUsername, hashedPassword)
            if (check) {
                const token = generateToken(ip)
                return NextResponse.json({ success: true, token })
            } else {
                return NextResponse.json({ success: false, message: "Credenziali errate" })
            }
        }
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Errore interno durante il login' }, { status: 500 });
    }
}