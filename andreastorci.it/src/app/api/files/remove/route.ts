import { NextResponse } from "next/server";
import { unlink } from "fs/promises";
import path from "path";

const folderUpload = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads'); 

export async function POST(req: Request) {
    try {
        const request = await req.json();

        if (!request.filename)
            return NextResponse.json({ error: "Non specificato il nome del file" }, { status: 400 })

        const { filename } = request;

        const safeFileName = path.basename(filename);
        const filePath = path.join(folderUpload, safeFileName);

        await unlink(filePath);
        console.log(`File ${safeFileName} rimosso con successo`);

        return NextResponse.json({ success: true });
        
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: `Errore interno durante il fetch dei dati: ${err}` }, { status: 500 });
    }
}