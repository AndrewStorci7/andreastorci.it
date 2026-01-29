import { LANGUAGES_TYPES, PersonalData, DeleteRouteProp } from "@ctypes";
import { NextResponse } from "next/server";
import db from "@lib/mongodb";

export async function POST(req: Request) {
    try {
        const data: DeleteRouteProp = await req.json();

        if (!data || !data.attribute || data.index === 0) {
            return NextResponse.json({ error: 'Dati non validi' }, { status: 400 });
        }

        LANGUAGES_TYPES.map(async (lang) => {
            // dati personali
            const pd = await db.collection<PersonalData>(lang).findOne({});
            // attributo da aggiornare 
            // const attrToUpdate: Project[] | Skill[] | ContactInfo | Education[] | Experience[] = pd ? pd[data.attribute] : [];
            const attrToUpdate = pd ? pd[data.attribute] : null;

            if (attrToUpdate) {
                if (Array.isArray(attrToUpdate)) {
                    const updatedArray = attrToUpdate.filter((_: any, i: number) => i !== data.index)
                    await db.collection(lang).updateOne({}, {
                        $set: { [data.attribute]: updatedArray }
                    })
                }
            } else {
                return NextResponse.json(
                    {
                        error: "Qualcosa è andato storto durante il tentativo di elimina!"
                    },
                    { status: 400 }
                )
            }

        })

        return NextResponse.json({ success: true });

    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: `Errore interno durante l'elimina ${err}` }, { status: 500 });
    }
}