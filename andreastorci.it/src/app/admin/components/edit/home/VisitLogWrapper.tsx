'use client'
import { BarChart, Bar, YAxis, XAxis, Tooltip, CartesianGrid, Cell, ResponsiveContainer } from "recharts";
import GeneralButtonsGroup from "@common/GeneralButtonsGroup";
import React, { useEffect, useState } from "react";
import { usePageSelector } from "@providers";
import { Type, Range } from "@ctypes/index";
import "@astyle/visitLogsWrapperStyle.css";

type DateType = {
    country: string;
    count: number;
}

const aggregateVisitsByDay = (days: string[]) => {
    const counts: Record<string, number> = {};

    days.forEach((isoDate) => {
        const day = isoDate.split("T")[0];

        counts[day] = (counts[day] || 0) + 1;
    });

    return Object.entries(counts)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));
}

const aggregateVisitsByCountry = (countries: Record<string, number>) => {
    const counts: Record<string, number> = countries;

    return Object.entries(counts)
        .map(([country, count]) => ({ country, count }));
}  

const getAllDaysOfMonth = (year: number, month: number) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const dates: string[] = [];

    for (let day = 2; day <= daysInMonth + 1; day++) {
        const date = new Date(year, month, day);
        const iso = date.toISOString().split("T")[0];
        dates.push(iso);
    }

    return dates;
};

const getCurrentWeekDates = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 (Sun) – 6 (Sat)

    const monday = new Date(today);
    const diffToMonday = (dayOfWeek + 6) % 7; // 0 => lun, 6 => dom
    monday.setDate(today.getDate() - diffToMonday);
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);


    return { start: monday, end: sunday };
};

const filterVisitsThisWeek = (days: string[]) => {
    const { start, end } = getCurrentWeekDates();
    // console.log(start, end)

    return days.filter((isoDate) => {
        const visitDate = new Date(isoDate);
        // console.log(visitDate >= start && visitDate <= end)
        return visitDate >= start && visitDate <= end;
    });
};

const fillMissingDates = (range: Range, visitData: { date: string; count: number; }[]) => {
    if (!range) {
        throw new Error("Range non valido")
    }

    switch (range) {
        case "week": {
            const { start } = getCurrentWeekDates(); // lunedì
            const dates: string[] = [];

            for ( let i = 0; i < 7; ++i ) {
                const date = new Date(start);
                date.setDate(start.getDate() + i);
                dates.push(date.toISOString().split("T")[0]); // "YYYY-MM-DD"
            }

            const dataMap = new Map(visitData.map((d) => [d.date, d.count]));
            return dates.map((date: string) => ({
                date,
                count: dataMap.get(date) || 0,
            }));
        }
        case "month": {
            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth();

            const allDays = getAllDaysOfMonth(year, month); 

            const dataMap = new Map(visitData.map((d) => [d.date, d.count]));

            return allDays.map((date: string) => ({
                date,
                count: dataMap.get(date) || 0,
            }));
        }
    }
};

const coloredBar = (data: DateType[] | null) => {
    if (!data) {
        return
    }

    return data.map((entry: DateType, index: number) => {
        const count = entry?.count;
        let fillColor = "#E0E0E0";

        if (count > 0 && count <= 2) fillColor = "#8FAE84";
        else if (count <= 5) fillColor = "#7BA46C";
        else if (count <= 10) fillColor = "#639550";
        else fillColor = "#44892B";

        return <Cell key={`cell-${index}`} fill={fillColor} />;
    })
}

const tickFormatterForDays = (dateStr: string, range: Range) => {
    // console.log(dateStr, range)
    switch (range) {
        case "week": {
            const date = new Date(dateStr);
            return date.toLocaleDateString("en-US", { weekday: "short" }); // "Mon", "Tue", etc.
        }
        default:
        case "month": {
            const [, , day] = dateStr.split("-");
            return parseInt(day, 10).toString();
        }
    }
}

const tickFormatterForCountries = (country: string) => {
    return country;
}

const VisitLogWrapper = ({
    title, 
    range = 'month',
    type = 'visits',
    width = 700,
    height = 300,
    className
}: {
    title?: string
    range?: Range,
    type?: Type,
    width?: number,
    height?: number
    className?: string
}) => {
    
    const [_type, setType] = useState<Type>(type)
    const [_range, setRange] = useState<Range>(range)
    const { setLoader } = usePageSelector()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [data, setData] = useState<any[]>()
    const [total, setTotal] = useState<number>()
    // const data = aggregateVisitsByDay([]);

    const fetchData = async (range: Range) => {
        // console.log(_range)
        try {
            setLoader(true);
            const req = await fetch(`/api/logs?type=${_type}&range=${_range}`) 
            const res = await req.json()
            console.log(res)
            if (res.success) {
                if (type === "country") {
                    const aggr = aggregateVisitsByCountry(res.data.countries)
                    setData(aggr)
                    console.log(aggr)
                } else {
                    // console.log(res.data.days)
                    let filtered;
                    if (range === "week") {
                        // console.log("week")
                        filtered = filterVisitsThisWeek(res.data.days)
                    } else {
                        filtered = res.data.days
                    }
                    const aggr = aggregateVisitsByDay(filtered);
                    const completed = fillMissingDates(range, aggr) ;
                    setData(completed)
                    // console.log(completed)
                }
                setTotal(res.data.total)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoader(false)
        }
    }

    const handleChange = (range: Range) => {
        setRange(range)
        fetchData(range)
    }

    useEffect(() => {
        setType(type)
        setRange(range)
        fetchData(range)
    }, [])

    return (
        <div className={`container visit-log-wrapper ${className}`}>
            <div className="flex space-between">
                <h3 className="title-wrapper">{title}</h3>
                {type === "visits" && (
                    <div>
                        <GeneralButtonsGroup defaultSelected={"month"} onChange={(e: Range) => handleChange(e)} buttonsValues={["week", "month", "!year", "!alltime"]} />
                        <p>Totale: {total}</p>
                    </div>
                )}
            </div>
            <ResponsiveContainer width="100%" height="100%" style={{ paddingBottom: 40 }}>
                <BarChart width={width} height={height} data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                        dataKey={type === "visits" ? "date" : "country"}
                        interval={_range === "month" ? 5 : 0}
                        // angle={-45}
                        // textAnchor="end"
                        tickFormatter={(e) => {
                            if (type === "visits") {
                                return tickFormatterForDays(e, _range);
                            } else {
                                return tickFormatterForCountries(e);
                            }
                        }}
                    />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" >
                        {coloredBar(data ?? null)}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default VisitLogWrapper;