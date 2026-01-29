import { NextResponse } from "next/server";

const newsApiKey = process.env.NEWS_API;

const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mese da 0 a 11
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export async function POST() {
    try {
        let today: Date | string = new Date();
        today.setMonth(today.getMonth() - 1)
        today = formatDate(today)

        const url = 'https://newsapi.org/v2/everything?' +
                    'q=artificial-intelligence+ai+ia+intelligenza-artificiale&' +
                    'from=' + today + '&' +
                    'sortBy=popularity&' +
                    'apiKey=' + newsApiKey;

        const reqNews = await fetch(url)
        const res = await reqNews.json()

        if (res.status === 'ok') {
            return NextResponse.json({ success: true, news: res.articles })
        } else {
            return NextResponse.json({ success: false, error: 'Errore nel fetch delle news' })
        }
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Errore interno durante l\'update' }, { status: 500 });
    }
}