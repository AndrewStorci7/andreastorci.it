'use client'
import { CommonData } from "@ctypes/CommonInfo";
import React, { useEffect, useState } from "react";
import { useCookie } from "@/inc/Cookies";
import Section from "@/inc/Section";

import "./style.css"
import "@style/globals.css"
import { GeneralData } from "@/types";
import PersonalInfo from "@/types/PersonalInfo";

const Page = () => {

    const [error, setError] = useState<string>("")
    const [commonData, setCommonData] = useState<GeneralData | null>(null)

    const [lang] = useCookie({ 
        name: 'language', 
        defaultValue: { 
            sku: 'it-IT', 
            id: 'IT', 
            name: 'Italiano', 
            flag: '/flags/it.png' 
        }
    });

    const getData = async () => {
        try {
            const commonInfo = new PersonalInfo(lang.sku);
            const commonData: CommonData | null = await commonInfo.getCommonInfos();
            console.log(commonData)
            setCommonData(commonData?.fuckWordpress ?? null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Errore sconosciuto');
        }
    }

    useEffect(() => {
        getData()
    }, [])

    if (error) {
        return (
            <Section home id='home' className='hero'>
                <div className="hero-content">
                    <div className="hero-text fade-in">
                        <h1>Errore: {error}</h1>
                    </div>
                </div>
            </Section>
        );
    }

    return (
        <div className="full center bg-fwp">
            <div className="fuck-wordpress-container center column">
                <h1>{commonData?.title}</h1>
                <p>{commonData?.description}</p>
                <div>
                    <ul>
                        <li><a href="https://devrant.com/rants/470241/fuck-wordpress">Fuck Wordpress</a></li>
                        <li><a href="https://www.reddit.com/r/Wordpress/comments/sx2sgh/wordpress_is_horrible_and_i_hate_it">Wordpress is orrible</a></li>
                        <li><a href="https://devrant.com/rants/1427857/fuck-you-and-your-wordpress">Fuck you and your wordpress</a></li>
                    </ul>
                </div>
            </div>
        </div>
    )
} 

export default Page