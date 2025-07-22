'use client'
import { useFadeInObserver } from "@components/inc/animated/FadeIn";
import PersonalInfo, { PersonalData } from "@/types/PersonalInfo";
import ContactSection from "@components/sections/ContactSection";
import SkillsSection from "@components/sections/SkillSection";
import LoadingOverlay from "@components/inc/animated/Loader";
import ProjectsSection from "@components/sections/Projects";
import CommonInfo, { CommonData } from "./types/CommonInfo";
import { showStyledLogo } from "@components/inc/ANSI";
import HeroSection from "@components/sections/Hero";
import { useCookie } from "@components/inc/Cookies";
import React, { useState, useEffect } from "react";
import Section from "@components/inc/Section";
import Header from "@/components/Header";

export default function Home() {
  
  const [pd, setPd] = useState<PersonalData | null>(null);
  const [commonData, setCommonData] = useState<CommonData | null>(null);
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
      const commonInfo = new CommonInfo(lang.sku);
      const data = await personalInfo.getPersonalData();
      const commonData = await commonInfo.getData();
      setPd(data);
      setCommonData(commonData);
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
  
  if (loading) {
    return <LoadingOverlay />
  }
  
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
    <div className="h-screen w-screen">
      <Header />
      <HeroSection data={pd} />
      <SkillsSection data={pd} />
      <ProjectsSection data={pd} />
      <ContactSection data={pd} />
    </div>
  );
}