import React, { useEffect, useState } from "react";
import "@astyle/newsWrapperStyle.css"

type NewsType = {
    source: {
        id: string | null
        name: string | null
    };
    author: string;
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: Date;
    content: string;
}

const NewsWrapper = () => {

    const [news, setNews] = useState<NewsType[]>()
    const [error, setError] = useState<string | any>()

    const getNews = async () => {
        try {
            const req = await fetch('/api/news', {
                method: 'POST'
            });
            const res = await req.json();
            if (res.success) {
                setNews(res.news);
            } else {
                setError(res.error);
            }
        } catch (err) {
            console.error(err);
            setError(err);
        }
    }

    
    const renderNews = (news: NewsType[] | null) => {
        if (!news) {
            return <p>Nessuna news trovata.</p>
        }

        return news.map((_news, index) => {
            const day = new Date(_news.publishedAt)
            return (
                <div key={index} id={String(index)} className={`relative grid grid-col-3 ${index === 0 ? "" : "hidden"}`}>
                    <div className="news-left-side" style={{
                        backgroundImage: `url(${_news.urlToImage}`
                    }} />
                    <div className="news-right-side grid-span-2">
                        <div className="space-y-4">
                            <h3>{_news.title}</h3>
                            <h5>{_news.author?? "Anonimous"} - <span>{day.toDateString()}</span></h5>
                            <p>{_news.description}</p>
                            <div>
                                <a href={_news.url} className="see-full-article">
                                    Vai all'articolo
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )
        })
    }
    
    useEffect(() => {
        getNews();
    }, []);

    return (
        <div className="news-wrapper">
            {renderNews(news ?? null)}
        </div>
    )
}

export default NewsWrapper;