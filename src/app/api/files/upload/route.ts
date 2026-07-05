import { writeFile, mkdir } from "fs/promises";
import { NextResponse } from "next/server";
import crypto from "crypto";
import path from "path";
import { z } from "zod";

const allowedTypes = ['image/jpeg', 'image/png'] as const;
const allowedExtensions = ['jpg', 'jpeg', 'png'] as const;

// Schema di validazione
const UploadSchema = z.object({
    file: z.custom<File>((val) => val instanceof File, {
        message: "File non valido"
    })
});

// Validazione dimensione e tipo
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file');

        // Validazione con Zod
        const validation = UploadSchema.safeParse({ file });
        if (!validation.success) {
            return NextResponse.json({ 
                error: `File non valido, ${validation.error}`,
            }, { status: 400 });
        }

        const validFile = validation.data.file;

        // Controllo tipo MIME
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!allowedTypes.includes(validFile.type as any)) {
            return NextResponse.json({ 
                error: "Tipo di file non supportato. Ammessi solo: " + allowedTypes.join(", ")
            }, { status: 400 });
        }

        // Controllo dimensione
        if (validFile.size > MAX_FILE_SIZE) {
            return NextResponse.json({ 
                error: `File troppo grande. Massimo ${MAX_FILE_SIZE / 1024 / 1024}MB` 
            }, { status: 400 });
        }

        // Estrazione e validazione estensione
        const fileExtension = validFile.name.split('.').pop()?.toLowerCase();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!fileExtension || !allowedExtensions.includes(fileExtension as any)) {
            return NextResponse.json({ 
                error: "Estensione non valida. Ammesse solo: " + allowedExtensions.join(", ")
            }, { status: 400 });
        }

        // Generazione nome sicuro
        const safeName = `${crypto.randomUUID()}.${fileExtension}`;
        
        // Verifica UPLOAD_DIR
        const uploadDir = process.env.UPLOAD_DIR;
        if (!uploadDir) {
            console.error("UPLOAD_DIR non definita");
            return NextResponse.json({ 
                error: "Configurazione server non valida" 
            }, { status: 500 });
        }

        // Verifica che UPLOAD_DIR sia un percorso assoluto e sicuro
        const resolvedUploadDir = path.resolve(uploadDir);
        
        // Crea directory se non esiste
        await mkdir(resolvedUploadDir, { recursive: true });

        const filePath = path.join(resolvedUploadDir, safeName);

        // Verifica che il file finale sia effettivamente dentro UPLOAD_DIR
        if (!filePath.startsWith(resolvedUploadDir + path.sep)) {
            console.error("Tentativo di path traversal:", filePath);
            return NextResponse.json({ 
                error: "Percorso file non valido" 
            }, { status: 400 });
        }

        // Scrivi file
        const bytes = await validFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filePath, buffer, { mode: 0o644 });

        console.log(`[UPLOAD SUCCESS] File: ${safeName}, Size: ${validFile.size}, Type: ${validFile.type}`);

        return NextResponse.json({ 
            success: true, 
            fileName: safeName 
        });

    } catch (err) {
        console.error("[UPLOAD ERROR]", err);
        return NextResponse.json({ 
            error: "Errore interno del server" 
        }, { status: 500 });
    }
}