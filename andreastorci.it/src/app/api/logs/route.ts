import db, { ObjectId, type LogsTable } from "@lib/mongodb";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { Type, Range } from "@ctypes";

const ipapi_secret = process.env.IPAPI_SECRET;
const collection = db.collection<LogsTable>("logs");

/**
 * Update data of logs
 * @returns 
 */
export async function POST() {
    try {
        const forwardedFor = (await headers()).get('x-forwarded-for');
        const ip = forwardedFor?.split(',')[0] ?? 'IP non disponibile';
        const res = await fetch(`https://api.ipapi.com/api/${ip}?access_key=${ipapi_secret}`);
        const data = await res.json();
        const country: string = data?.country_name?.toLowerCase().trim();
        const countrypath = `alltime_visits.visits_country.${country}`;
        const now = new Date().toISOString();

        let body;
        if (country === undefined || !country) {
            body = {
                $inc: { 
                    "alltime_visits.visits.total": 1,
                },
                $push: { "alltime_visits.visits.days": now }
            }
        } else {
            body = {
                $inc: { 
                    "alltime_visits.visits.total": 1,
                    [countrypath]: 1 
                },
                $push: { "alltime_visits.visits.days": now }
            }
        }

        const updateLog = await collection.updateOne(
            { _id: new ObjectId(process.env.LOGS_ID) },
            body
        );

        return NextResponse.json({ success: true, data: updateLog })

    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Errore interno durante l\'update del log file' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);

        const type = searchParams.get('type') as Type;
        const range = searchParams.get('range') as Range;

        if (!type || !range) {
            return NextResponse.json({ error: 'Dati non validi' }, { status: 400 });
        }

        const data = await collection.findOne(
            { _id: new ObjectId(process.env.LOGS_ID) }
        );

        if (data) {
            return NextResponse.json({ success: true, data: data });
        } else {
            return NextResponse.json({ success: false, error: "Qualcosa e' andato storto" })
        }

    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Errore interno durante l\'update del log file' }, { status: 500 });
    }
}