import { NextResponse } from "next/server";
import { PersonalData } from "@ctypes/PersonalInfo";
import db from "@lib/mongodb";
import { CommonData } from "@ctypes/CommonInfo";

interface LanguageToFetch {
    language: string
}

interface AllDataFetched extends PersonalData, CommonData {};

export async function POST(req: Request) {
    try {
        const data: LanguageToFetch = await req.json();
        const PersonalData = db.collection<AllDataFetched>(data.language);
        const dataFetched = await PersonalData.findOne({}); 

        if (dataFetched) {
            return NextResponse.json(dataFetched);
        } else {
            return NextResponse.json({ success: false, message: "Errore nel fetch dei dati, può essere che la lingua richiesta non sia supportata" });
        }

        
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: `Errore interno durante il fetch dei dati: ${err}` }, { status: 500 });
    }
}