import { unlink, access, stat } from "fs/promises";
import { NextResponse } from "next/server";
import { constants } from "fs";
import path from "path";
import { z } from "zod";

const allowedExtensions = ['jpg', 'jpeg', 'png'] as const;

// Schema di validazione
const DeleteSchema = z.object({
    filename: z.string()
        .min(1, "Nome file richiesto")
        .max(255, "Nome file troppo lungo")
        .regex(
            /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\.(jpg|jpeg|png)$/i,
            "Nome file non valido. Formato atteso: UUID.estensione"
        )
});

export async function POST(req: Request) {
    try {
        const request = await req.json();

        // Validazione con Zod
        const validation = DeleteSchema.safeParse(request);
        if (!validation.success) {
            return NextResponse.json({ 
                error: `"Richiesta non valida, ${validation.error}`,
            }, { status: 400 });
        }

        const { filename } = validation.data;

        // Verifica UPLOAD_DIR
        const uploadDir = process.env.UPLOAD_DIR;
        if (!uploadDir) {
            console.error("UPLOAD_DIR non definita");
            return NextResponse.json({ 
                error: "Configurazione server non valida" 
            }, { status: 500 });
        }

        const resolvedUploadDir = path.resolve(uploadDir);

        // Usa basename per prevenire path traversal
        const safeFileName = path.basename(filename);
        
        // Doppio controllo: il nome deve coincidere con l'input validato
        if (safeFileName !== filename) {
            console.error("Tentativo di path traversal:", filename);
            return NextResponse.json({ 
                error: "Nome file non valido" 
            }, { status: 400 });
        }

        const filePath = path.join(resolvedUploadDir, safeFileName);

        // Verifica che il percorso finale sia dentro UPLOAD_DIR
        if (!filePath.startsWith(resolvedUploadDir + path.sep)) {
            console.error("Tentativo di path traversal:", filePath);
            return NextResponse.json({ 
                error: "Percorso file non valido" 
            }, { status: 400 });
        }

        // Verifica che il file esista e sia un file normale (non directory, symlink, etc.)
        try {
            await access(filePath, constants.F_OK);
            const stats = await stat(filePath);
            
            if (!stats.isFile()) {
                console.error("Non è un file regolare:", filePath);
                return NextResponse.json({ 
                    error: "Il percorso non corrisponde a un file valido" 
                }, { status: 400 });
            }
        } catch {
            return NextResponse.json({ 
                error: "File non trovato" 
            }, { status: 404 });
        }

        // Verifica estensione ancora una volta
        const ext = path.extname(safeFileName).toLowerCase().slice(1);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!allowedExtensions.includes(ext as any)) {
            return NextResponse.json({ 
                error: "Tipo di file non permesso per eliminazione" 
            }, { status: 403 });
        }

        // Elimina il file
        await unlink(filePath);
        
        // Log successo
        console.log(`[DELETE SUCCESS] File: ${safeFileName}`);

        return NextResponse.json({ success: true });
        
    } catch (err) {
        console.error("[DELETE ERROR]", err);
        return NextResponse.json({ 
            error: "Errore interno del server" 
        }, { status: 500 });
    }
}