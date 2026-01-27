import { PersonalData, Skill } from "@ctypes";
import { NextResponse } from "next/server";
import db from "@lib/mongodb";
import z from "zod"

const collection = db.collection<PersonalData>("it-IT");

const SkillSchema = z.object({
    name: z.string().max(50),
    category: z.string().max(50),
    level: z.number().max(10)
});

export async function POST(req: Request) {
    try {
        const newData: Skill = await req.json();

        const check = SkillSchema.safeParse(newData) 

        if (!check.success)
            return NextResponse.json({ success: false, message: "Non è stato possibile aggiungere alcun dato" }, { status: 400 })

        await collection.updateOne({}, {
            $push: { skills: check.data }
        });

        return NextResponse.json({ success: true })

    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: `Errore interno durante il fetch dei dati: ${err}` }, { status: 500 });
    }
}