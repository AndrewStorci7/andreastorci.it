import { PersonalData } from "@ctypes/PersonalInfo";
import { CommonData } from "@ctypes/CommonInfo";
import { NextResponse } from "next/server";
import { Languages, LANGUAGES_TYPES } from "@ctypes/index";
import db from "@lib/mongodb";

interface LanguageToFetch {
    language: Languages
}

interface AllDataFetched extends PersonalData, CommonData {};

export async function POST(req: Request) {
    try {
        const data: LanguageToFetch = await req.json();

        if (!LANGUAGES_TYPES.includes(data.language)) {
            return NextResponse.json({ success: false, message: "Lingua inserita non ancora supportata" });
        }

        const PersonalData = db.collection<AllDataFetched>(data.language);
        const dataFetched = await PersonalData.findOne({}); 

        if (dataFetched) {
            return NextResponse.json({ success: true, data: dataFetched });
        } else {
            return NextResponse.json({ success: false, message: "Errore nel fetch dei dati, può essere che la lingua richiesta non sia supportata" });
        }

        
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: `Errore interno durante il fetch dei dati: ${err}` }, { status: 500 });
    }
}