import React from "react";
import NewsWrapper from "@components/edit/home/NewsWrapper";
import VisitLogWrapper from "@components/edit/home/VisitLogWrapper";

const HomePage = () => {

    return (
        <>
            <h1>HomePage</h1>
            <NewsWrapper />
            <div className="grid grid-col-3 min-h-400pxi h-fit">
                <VisitLogWrapper 
                    className="grid-span-2 w-100i h-100i" 
                    title={"Storico visualizzazioni pagine"} 
                    type="visits" 
                    range="month" 
                />
                <VisitLogWrapper 
                    className="w-100i h-100i" 
                    title={"Paesi raggiunti"} 
                    width={500} 
                    type="country" 
                    range="week"
                />
            </div>
        </>
    );
}

export default HomePage;