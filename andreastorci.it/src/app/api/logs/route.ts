import { readFile, writeFile } from "fs/promises";
import { Type, Range, LOG_TYPES, LOG_RANGES } from "@ctypes/index";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import path from "path";

const ipapi_secret = process.env.IPAPI_SECRET;
const logsPath = path.join(process.cwd() + '/public/data', 'logs.json');

type LogRequestType = {
    range: Range,
    type: Type,
}

type SingleVisit = {
    total: number,
    days: Date[]
}

type FilteredLogsType = {
    visits: SingleVisit,
    visits_country: Map<string, number> | null
}

type LogsType = {
    alltime_visits: FilteredLogsType,
    // visits_this_week: FilteredLogsType,
    // visits_this_month: FilteredLogsType,
    // visits_this_year: FilteredLogsType,
}

export async function POST(req: Request) {
    try {
        const forwardedFor = (await headers()).get('x-forwarded-for');
        const ip = forwardedFor?.split(',')[0] ?? 'IP non disponibile';
        const now = new Date()
        const res = await fetch(`https://api.ipapi.com/api/${ip}?access_key=${ipapi_secret}`);
        const data = await res.json();
        const country: string = data?.country_name?.toLowerCase();
        const logFile = await readFile(logsPath, 'utf8')
        const log = JSON.parse(logFile)

        log.alltime_visits.visits.total += 1;
        log.alltime_visits.visits.days.push(now);
        // log.visits_this_week.visits.total += 1;
        // log.visits_this_week.visits.days.push(now);
        // log.visits_this_month.visits.total += 1;
        // log.visits_this_month.visits.days.push(now);
        // log.visits_this_year.visits.total += 1;
        // log.visits_this_year.visits.days.push(now);

        if (country) {
            if (log.alltime_visits.visits_country[country]) {
                log.alltime_visits.visits_country[country] += 1
            } else {
                log.alltime_visits.visits_country[country] = 1
            }

            // if (log.visits_this_week.visits_country[country]) {
            //     log.visits_this_week.visits_country[country] += 1
            // } else {
            //     log.visits_this_week.visits_country[country] = 1
            // }

            // if (log.visits_this_month.visits_country[country]) {
            //     log.visits_this_month.visits_country[country] += 1
            // } else {
            //     log.visits_this_month.visits_country[country] = 1
            // }

            // if (log.visits_this_year.visits_country[country]) {
            //     log.visits_this_year.visits_country[country] += 1
            // } else {
            //     log.visits_this_year.visits_country[country] = 1
            // }
        }

        await writeFile(logsPath, JSON.stringify(log, null, 2), 'utf-8')

        return NextResponse.json({ success: true })

    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Errore interno durante l\'update del log file' }, { status: 500 });
    }
}

const fetchData = (type: Type, range: Range, log: LogsType) => {
    try {
        if (!LOG_TYPES.includes(type)) {
            throw new Error(`type non valido. Può essere solo uno di: ${LOG_TYPES.join(', ')}`)
        }
        if (!LOG_RANGES.includes(range)) {
            throw new Error(`type non valido. Può essere solo uno di: ${LOG_RANGES.join(', ')}`)
        }

        switch (range) {
            // case 'week':
            //     return type === 'visits' ? log.visits_this_week.visits : log.visits_this_week.visits_country;
            // case 'month':
            //     return type === 'visits' ? log.visits_this_month.visits : log.visits_this_month.visits_country;
            // case 'year':
            //     return type === 'visits' ? log.visits_this_year.visits : log.visits_this_year.visits_country;
            default:
            case 'alltime':
                return type === 'visits' ? 
                    log.alltime_visits.visits : 
                    { 
                        total: log.alltime_visits.visits.total, 
                        countries: log.alltime_visits.visits_country,
                    };
        }

    } catch (err) {
        throw new Error(`Qualcosa e' andato storto nel fetch dei dati di log: ${err}`)
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);

        const type = searchParams.get('type') as Type;
        const range = searchParams.get('range') as Range;

        if (!type || !range) {
            return NextResponse.json({ error: 'Dati non validi' }, { status: 400 });
        }

        const logFile = await readFile(logsPath, 'utf8')
        const log = JSON.parse(logFile)
        const data = fetchData(type, range, log) 
        // console.log(data)
        if (data) {
            return NextResponse.json({ success: true, data: data })
        } else {
            return NextResponse.json({ success: false, error: "Qualcosa e' andato storto" })
        }

    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Errore interno durante l\'update del log file' }, { status: 500 });
    }
}