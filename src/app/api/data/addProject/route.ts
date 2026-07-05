import { LANGUAGES_TYPES, PersonalData, Project } from "@ctypes";
import { NextResponse } from "next/server";
import db from "@lib/mongodb";
import z from "zod"

const ProjectSchema = z.object({
    lang: z.enum(LANGUAGES_TYPES, "Lingua non valida"),
    name: z.string().max(50),
    type: z.string().max(50),
    description: z.string().max(20000),
    technologies: z.array(z.string().max(50)).min(1),
    link: z.string(),
    role: z.array(z.string().max(50)).min(1),
    image: z.string(),
    sku: z.string()
});

export async function POST(req: Request) {
    try {
        const newData: Project = await req.json();

        const check = ProjectSchema.safeParse(newData);
        // console.log(check)

        if (!check.success)
            return NextResponse.json({ success: false, message: "Non è stato possibile aggiungere alcun dato" }, { status: 400 })

        const collection = db.collection<PersonalData>(check.data.lang);
        const { lang, ...realData } = check.data;
        console.log(`[ADD PROJECT] Lingua: ${lang}, Dati: ${JSON.stringify(realData)}`);

        await collection.updateOne({}, {
            $push: { projects: realData }
        })

        return NextResponse.json({ success: true })

    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: `Errore interno durante il fetch dei dati: ${err}` }, { status: 500 });
    }
}