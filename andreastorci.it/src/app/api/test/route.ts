import db, { ObjectId, type LogsTable } from "@lib/mongodb";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

const ipapi_secret = process.env.IPAPI_SECRET;

export async function POST() {
    try {
        const forwardedFor = (await headers()).get('x-forwarded-for');
        const ip = forwardedFor?.split(',')[0] ?? 'IP non disponibile';
        const res = await fetch(`https://api.ipapi.com/api/${ip}?access_key=${ipapi_secret}`);
        const data = await res.json();
        const country: string = data?.country_name?.toLowerCase();
        const countrypath = `alltime_visits.visits_country.${country}`;

        const now = new Date().toISOString();
        const collection = db.collection<LogsTable>("logs");
        const updateLog = await collection.updateOne(
            { _id: new ObjectId(process.env.LOGS_ID) },
            { 
                $inc: { 
                    "alltime_visits.visits.total": 1,
                    [countrypath]: 1 
                },
                $push: { "alltime_visits.visits.days": now }
            }
        );

        return NextResponse.json({ updateLog });
    } catch (error) {
        console.error("Errore MongoDB:", error);
        return NextResponse.json({ error: 'Errore connessione DB' }, { status: 500 });
    }
}
