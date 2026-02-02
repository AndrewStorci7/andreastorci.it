import { LANGUAGES_TYPES, PersonalData, Skill } from "@ctypes";
import { NextResponse } from "next/server";
import db from "@lib/mongodb";
import z from "zod"

const SkillSchema = z.object({
    lang: z.enum(LANGUAGES_TYPES, "Lingua non valida"),
    name: z.string().max(50),
    level: z.coerce.number().max(10),
    category: z.string().max(50),
});

export async function POST(req: Request) {
    try {
        const newData: Skill = await req.json();

        const check = SkillSchema.safeParse(newData) 

        if (!check.success)
            return NextResponse.json({ success: false, message: "Non è stato possibile aggiungere alcun dato" }, { status: 400 })

        const collection = db.collection<PersonalData>(check.data.lang);
        const { lang, ...realData } = check.data;

        await collection.updateOne({}, {
            $push: { skills: realData }
        });

        return NextResponse.json({ success: true })

    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: `Errore interno durante il fetch dei dati: ${err}` }, { status: 500 });
    }
}