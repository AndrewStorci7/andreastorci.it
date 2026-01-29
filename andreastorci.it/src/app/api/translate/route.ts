/* eslint-disable @typescript-eslint/no-explicit-any */
import { Project, Education, Skill, ContactInfo, Experience } from "@ctypes";
import { NextResponse } from "next/server";

const TRANSLATION_URL = process.env.TRANSLATION_URL || ""

interface TranslateProp {
    data: string | Project | Education | Skill | ContactInfo | Experience
    lang: string
}

export async function POST(req: Request) {
    try {
        const reqData: TranslateProp = await req.json()

        if (!reqData.data) {
            return NextResponse.json({ error: 'Dati non validi' }, { status: 400 });
        }
        if (!reqData.lang) {
            return NextResponse.json({ error: 'Lingua non valida' }, { status: 400 });
        }

        let body = {}
        if (typeof reqData.data === 'string') {
            body = {
                q: reqData.data,
                source: "it",
                target: reqData.lang,
                format: "text",
            }

            const transReq = await fetch(TRANSLATION_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const trans = await transReq.json();
            return NextResponse.json({ success: true, translation: trans.translatedText });
        } else {

            const trans: Record<string, string> = {};
            const entries = Object.entries(reqData.data)

            const translatedEntries = await Promise.all(entries.map(async ([key, value]) => {
                const body = {
                    q: String(value),
                    source: "auto",
                    target: reqData.lang,
                    format: "text"
                };

                const response = await fetch(TRANSLATION_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                });

                const json = await response.json();
                return [key, json.translatedText];
            }));

            translatedEntries.forEach(([key, translatedValue]) => {
                trans[key] = translatedValue;
            });

            return NextResponse.json({ success: true, translation: trans });
        }
    } catch (err: Error | ErrorEvent | any) {
        console.error(err);
        return NextResponse.json({ error: 'Errore interno', message: err?.message }, { status: 500 });
    }
}