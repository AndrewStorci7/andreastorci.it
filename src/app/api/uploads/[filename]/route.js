import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const uploadDir = process.env.UPLOAD_DIR || '';

export async function GET(request, { params }) {
    const { filename } = await params;
    
    if (uploadDir === '') {
        return new NextResponse('Directory di upload non configurata', { status: 500 });
    }

    const filePath = path.join(uploadDir, filename);

    console.log(`Accessing file: ${filePath}`);

    if (!fs.existsSync(filePath)) {
        return new NextResponse('Immagine non trovata', { status: 404 });
    }

    try {
        // 2. Leggi il file come Buffer grezzo
        const fileBuffer = fs.readFileSync(filePath);
        
        // 3. Trova l'estensione corretta
        const ext = path.extname(filename).toLowerCase();
        let contentType = 'image/jpeg';
        if (ext === '.png') contentType = 'image/png';
        if (ext === '.webp') contentType = 'image/webp';
        if (ext === '.gif') contentType = 'image/gif';
        if (ext === '.svg') contentType = 'image/svg+xml';

        // 4. IMPORTANTE: Trasforma il buffer in un Uint8Array o Blob per NextResponse
        return new NextResponse(new Uint8Array(fileBuffer), {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch (error) {
        return new NextResponse('Errore server', { status: 500 });
    }
}