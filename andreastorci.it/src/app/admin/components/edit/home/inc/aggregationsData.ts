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

const aggregateVisitsByMonth = (visits: { date: string; count: number }[]) => {
    const monthlyCounts: Record<string, number> = {};
    
    visits.forEach(item => {
        const monthKey = item.date.substring(0, 7); // Prende "YYYY-MM"
        monthlyCounts[monthKey] = (monthlyCounts[monthKey] || 0) + item.count;
    });

    return Object.entries(monthlyCounts).map(([month, count]) => ({
        date: `${month}-01`, // Data fittizia per il formatter
        count
    }));
};

const aggregateVisitsByCountry = (countries: Record<string, number>) => {
    const counts: Record<string, number> = countries;

    return Object.entries(counts)
        .map(([country, count]) => ({ country, count }));
}

export {
    aggregateVisitsByCountry,
    aggregateVisitsByDay,
    aggregateVisitsByMonth
}