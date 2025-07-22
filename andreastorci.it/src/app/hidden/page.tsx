'use client'
import React, { useState, useEffect } from "react";
import { useFadeInObserver } from "@/components/inc/animated/FadeIn";
import HeroSection from "@/components/sections/Hero";
import FlagChooser from "@components/inc/FlagChooser";
import PersonalInfo, { PersonalData } from "@/types/PersonalInfo";
import { useCookie } from "@components/inc/Cookies";
import { showStyledLogo } from "@components/inc/ANSI";

const HiddenPage = () => {

    const [pd, setPd] = useState<PersonalData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    const [lang] = useCookie({ 
        name: 'language', 
        defaultValue: { 
        sku: 'it-IT', 
        id: 'IT', 
        name: 'Italiano', 
        flag: '/flags/it.png' 
        }
    });

    useFadeInObserver('.fade-in');
    
    const getData = async (languageSku: string) => {
        try {
            setLoading(true);
            setError(null);
            
            const personalInfo = new PersonalInfo(lang.sku);
            const data = await personalInfo.getPersonalData();
            setPd(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Errore sconosciuto');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {

        showStyledLogo();

        const timer = setTimeout(() => {
        setIsInitialized(true);
        }, 0);
        
        return () => clearTimeout(timer);
    }, []);
    
    useEffect(() => {
        if (isInitialized && lang && lang.sku) {
            getData(lang.sku);
        }
    }, [isInitialized, lang]);

    useFadeInObserver()

    return (
        <div>
            <h1>Hidden Page</h1>
            <HeroSection data={pd} />
        </div>
    );
}

export default HiddenPage;
