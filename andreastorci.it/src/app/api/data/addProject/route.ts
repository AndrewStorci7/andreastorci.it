import { PersonalData, Project } from "@ctypes";
import { NextResponse } from "next/server";
import db from "@lib/mongodb";
import z from "zod"

const collection = db.collection<PersonalData>("it-IT");

const ProjectSchema = z.object({
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
        console.log(newData);

        const check = ProjectSchema.safeParse(newData);
        // console.log(check)

        if (!check.success)
            return NextResponse.json({ success: false, message: "Non è stato possibile aggiungere alcun dato" }, { status: 400 })

        await collection.updateOne({}, {
            $push: { projects: check.data }
        })

        return NextResponse.json({ success: true })

    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: `Errore interno durante il fetch dei dati: ${err}` }, { status: 500 });
    }
}