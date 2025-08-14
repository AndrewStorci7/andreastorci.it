import CircularLoader from "@inc/animated/CircularLoader";
import React, { useEffect, useState } from "react";
import { usePageSelector } from "@providers";
import "@astyle/newsWrapperStyle.css";

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

const NewsWrapper = ({
    className,
}: {
    className?: string
}) => {

    const { setLoader } = usePageSelector();
    const [news, setNews] = useState<NewsType[]>();
    const [, setError] = useState<string | null>();
    const [currentIndex, setCurrentIndex] = useState<number>(0)
    const [clock, setClock] = useState<boolean>(false)

    const DURATION = 10000
    
    const getNews = async () => {
        try {
            setLoader(true)
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
            setError(JSON.stringify(err));
        } finally {
            setLoader(false)
        }
    }

    
    const renderNews = (news: NewsType[] | null) => {
        if (!news) {
            return <p>Nessuna news trovata.</p>
        }

        const currentNews = news[currentIndex]
        const day = new Date(currentNews.publishedAt)

        return (
            <div key={currentIndex} id={String(currentIndex)} className="wrapper-container expose">
                <div className="news-left-side" style={{
                    backgroundImage: `url(${currentNews.urlToImage}`
                }} />
                <div className="flex news-right-side grid-span-2">
                    <div className="space-y-4">
                        <h3>{currentNews.title}</h3>
                        <h5>{currentNews.author?? "Anonimous"} - <span>{day.toDateString()}</span></h5>
                        <p>{currentNews.content}</p>
                        <div className="flex grid-col-2 space-between fix-to-bottom">
                            <a href={currentNews.url} className="see-full-article">
                                Vai all&apos;articolo
                            </a>
                            <CircularLoader start={clock} size={35} duration={DURATION} strokeWidth={4} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    
    useEffect(() => {
        getNews();
    }, []);

    useEffect(() => {
        if (!news || news.length === 0) return;

        const interval = setInterval(() => {
            setClock(prev => !prev)
            setCurrentIndex((prev) =>
                prev + 1 < news.length ? prev + 1 : 0
            );
        }, DURATION);

        return () => clearInterval(interval);
    }, [news]);

    return (
        <div className={`container news-wrapper ${className}`}>
            {renderNews(news ?? null)}
        </div>
    )
}

export default NewsWrapper;