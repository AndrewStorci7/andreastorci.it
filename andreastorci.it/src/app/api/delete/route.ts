/* eslint-disable @typescript-eslint/no-explicit-any */
import { readFile, writeFile } from 'fs/promises';
import { NextResponse } from "next/server";
import path from 'path';

const pathLangs = {
    it: path.join(process.cwd() + '/public/data', 'it-IT.json'),
    es: path.join(process.cwd() + '/public/data', 'es-ES.json'),
    en: path.join(process.cwd() + '/public/data', 'en-GB.json'),
}

interface DeleteRouteProp {
    attribute: 'projects' | 'contacts' | 'education' | 'experience' | 'skills' | 'languages',
    index: number,
    // lang: string,
}

export async function POST(req: Request) {
    try {
        const data: DeleteRouteProp = await req.json();

        if (!data || !data.attribute || data.index === 0) {
            return NextResponse.json({ error: 'Dati non validi' }, { status: 400 });
        }

        // Italiano
        const it = await readFile(pathLangs.it, 'utf8')
        const itJSON = JSON.parse(it)
        const updatedArrayIt = (itJSON[data.attribute] || []).filter((_: any, index: number) => index !== data.index);
        itJSON[data.attribute] = updatedArrayIt;
        await writeFile(pathLangs.it, JSON.stringify(itJSON, null, 2), 'utf-8');

        // Spagnolo
        const es = await readFile(pathLangs.es, 'utf8')
        const esJSON = JSON.parse(es)
        const updatedArrayEs = (esJSON[data.attribute] || []).filter((_: any, index: number) => index !== data.index);
        esJSON[data.attribute] = updatedArrayEs;
        await writeFile(pathLangs.es, JSON.stringify(esJSON, null, 2), 'utf-8');

        // Inglese
        const en = await readFile(pathLangs.en, 'utf8')
        const enJSON = JSON.parse(en)
        const updatedArrayEn = (enJSON[data.attribute] || []).filter((_: any, index: number) => index !== data.index);
        enJSON[data.attribute] = updatedArrayEn;
        await writeFile(pathLangs.en, JSON.stringify(enJSON, null, 2), 'utf-8');

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: `Errore interno durante l'elimina ${err}` }, { status: 500 });
    }
}