import { Project, Education, Skill, ContactInfo, Experience } from "@ctypes/index";
import { readFile, writeFile } from 'fs/promises';
import { fpath, it, es, en } from "@apicnf";
import { NextResponse } from 'next/server';
import path from 'path';

const pathLangs = {
    it: path.join(fpath, it),
    es: path.join(fpath, es),
    en: path.join(fpath, en),
}

interface UpdateRouteProp {
    dataIt: Project | Education | Skill | ContactInfo | Experience;
    dataEs: Project | Education | Skill | ContactInfo | Experience;
    dataEn: Project | Education | Skill | ContactInfo | Experience;
    updateProp: string
}

export async function POST(req: Request) {
    try {
        const data: UpdateRouteProp = await req.json();

        // console.log(data)
        if (!data || !data.dataEn || !data.dataEs || !data.dataIt) {
            return NextResponse.json({ error: 'Dati non validi' }, { status: 400 });
        }
        if (!data.updateProp) {
            return NextResponse.json({ error: 'non e\' stato specificato l\'attributo da aggiornare' }, { status: 400 });
        }

        console.log(data.updateProp)
        // Italiano
        const it = await readFile(pathLangs.it, 'utf8')
        const itJSON = JSON.parse(it)
        itJSON[data.updateProp] = [
            ...(itJSON[data.updateProp] || []),
            data.dataIt
        ];
        await writeFile(pathLangs.it, JSON.stringify(itJSON, null, 2), 'utf-8');

        // Spagnolo
        const es = await readFile(pathLangs.es, 'utf8')
        const esJSON = JSON.parse(es)
        esJSON[data.updateProp] = [
            ...(esJSON[data.updateProp] || []),
            data.dataEs
        ];
        await writeFile(pathLangs.es, JSON.stringify(esJSON, null, 2), 'utf-8');

        // Inglese
        const en = await readFile(pathLangs.en, 'utf8')
        const enJSON = JSON.parse(en)
        enJSON[data.updateProp] = [
            ...(enJSON[data.updateProp] || []),
            data.dataEn
        ];
        await writeFile(pathLangs.en, JSON.stringify(enJSON, null, 2), 'utf-8');

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Errore interno durante l\'update' }, { status: 500 });
    }
}
