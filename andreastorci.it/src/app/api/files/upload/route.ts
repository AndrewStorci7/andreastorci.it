import { writeFile, mkdir } from "fs/promises";
import { NextResponse } from "next/server";
import crypto from "crypto";
import path from "path";

const allowedTypes = ['image/jpeg', 'image/png'];

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: "Nessun file fornito" }, { status: 400 });
        }

        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: "Tipo di file non supportato" }, { status: 400 });
        }

        // masismo 5MB
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: "File troppo grande" }, { status: 400 });
        }

        const fileExtension = file.name.split('.').pop();
        const safeName = `${crypto.randomUUID()}.${fileExtension}`;
        
        // Definiamo un percorso FUORI dalla cartella del codice, se possibile
        const uploadDir = process.env.UPLOAD_DIR;
        if (!uploadDir) {
            return NextResponse.json({ error: "Variabile d'ambiente `UPLOAD_DIR` non definita" }, { status: 500 });
        }

        await mkdir(uploadDir, { recursive: true });

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filePath = path.join(uploadDir, safeName);

        await writeFile(filePath, buffer);

        // Salva il riferimento nel DB (es. il nome del file o l'URL relativo)
        // db.collection('projects').updateOne(...)

        return NextResponse.json({ success: true, fileName: safeName });

    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: `Errore interno durante il fetch dei dati: ${err}` }, { status: 500 });
    }
}