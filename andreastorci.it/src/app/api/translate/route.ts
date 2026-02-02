/* eslint-disable @typescript-eslint/no-explicit-any */
import { 
    Project, 
    Education, 
    Skill, 
    ContactInfo, 
    Experience, 
    SKIP_TRANS_ATTRIBUTES_SKILL,
    SKIP_TRANS_ATTRIBUTES_PROJECT, 
    Attributes
} from "@ctypes";
import { NextResponse } from "next/server";

const TRANSLATION_URL = process.env.TRANSLATION_URL || ""

type PossibleDataTrans = Project | Education | Skill | ContactInfo | Experience | string

interface TranslateProp {
    attribute: Attributes,
    data: PossibleDataTrans
    lang: string
}

const checkTypeData = (attribute: Attributes): Set<string> => {
    switch (attribute) {
        default:
        case "projects":
            return SKIP_TRANS_ATTRIBUTES_PROJECT;
        case "skills":
            return SKIP_TRANS_ATTRIBUTES_SKILL;
        // case "education":
        //     return "education";
        // case "contact":
        //     return "contactInfo";
        // case "experience":
        //     return "experience";
        // case "languages":
        //     return "language";
        // default:
        //     return "unknown";
    }
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
        const sourceLang = "it";
        const targetLang = reqData.lang.slice(0, 2);

        if (typeof reqData.data === 'string') {
            body = {
                q: reqData.data,
                source: sourceLang,
                target: targetLang,
                format: "text",
            }

            const transReq = await fetch(TRANSLATION_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const trans = await transReq.json();

            if (trans.error) {
                console.error(trans.error);
                return NextResponse.json({
                    error: `Errore nella traduzione: ${trans.error}`
                }, { status: 500 });
            }

            return NextResponse.json({ success: true, translation: trans.translatedText });
        } else {

            const trans: Record<string, any> = {};
            const entries = Object.entries(reqData.data);
            const skipValues = checkTypeData(reqData.attribute);

            const translatedEntries = await Promise.all(entries.map(async ([key, value]) => {
                if (skipValues.has(key) || !value) {
                    return [key, value];
                }

                if (Array.isArray(value)) {
                    const translatedArray = await Promise.all(value.map(async (item) => {
                        const res = await fetch(TRANSLATION_URL, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                q: String(item),
                                source: sourceLang,
                                target: targetLang,
                                format: "text"
                            })
                        });
                        const json = await res.json();
                        return json.translatedText;
                    }));
                    return [key, translatedArray];
                }

                // Traduzione standard per stringhe singole
                const body = {
                    q: String(value),
                    source: sourceLang,
                    target: targetLang,
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