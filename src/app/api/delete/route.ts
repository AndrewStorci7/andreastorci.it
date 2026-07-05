import { 
    ATTRIBUTES, 
    LANGUAGES_TYPES, 
    PersonalData, 
    DeleteRouteProp, 
    PossibleContent, 
    Attributes 
} from "@ctypes";
import { NextResponse } from "next/server";
import db from "@lib/mongodb";
import z from "zod";

const DeleteSchema = z.object({
    attribute: z.enum(ATTRIBUTES, "L'attributo fornito non è valido"),
    index: z.number().min(0)
})

export async function POST(req: Request) {
    try {
        const data: DeleteRouteProp = await req.json();

        // Validazione con Zod
        const validation = DeleteSchema.safeParse(data);
        if (!validation.success) {
            return NextResponse.json({ error: "Dati non validi" }, { status: 400 });
        }

        const { attribute, index }: { 
            attribute: Attributes; 
            index: number } = validation.data;

        LANGUAGES_TYPES.map(async (lang) => {
            // dati personali
            const pd = await db.collection<PersonalData>(lang).findOne({});
            // attributo da aggiornare 
            const attrToUpdate: PossibleContent = pd ? pd[attribute] : null;

            if (attrToUpdate) {
                if (Array.isArray(attrToUpdate)) {
                    const updatedArray = attrToUpdate.filter((_: unknown, i: number) => i !== index)
                    await db.collection(lang).updateOne({}, {
                        $set: { [attribute]: updatedArray }
                    })
                }
            } else {
                return NextResponse.json(
                    { error: "Qualcosa è andato storto durante il tentativo di elimina!" },
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