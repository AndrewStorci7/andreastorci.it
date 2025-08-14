'use client'
import { useFadeInObserver } from "@inc/animated/FadeIn";
import PersonalInfo, { PersonalData } from "@ctypes/PersonalInfo";
import ContactSection from "@components/sections/ContactSection";
import SkillsSection from "@components/sections/SkillSection";
import LoadingOverlay from "@inc/animated/Loader";
import ProjectsSection from "@components/sections/Projects";
import CommonInfo, { CommonData } from "@ctypes/CommonInfo";
import { showDreeanLogo } from "@inc/ANSI";
import HeroSection from "@components/sections/Hero";
import { useCookie } from "@inc/Cookies";
import React, { useState, useEffect } from "react";
import Section from "@inc/Section";
import Header from "@components/Header";

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
  
  const getData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await fetch('/api/logs', { method: 'POST' })
      const personalInfo = new PersonalInfo(lang.sku);
      const commonInfo = new CommonInfo(lang.sku);
      const data = await personalInfo.getPersonalData();
      const commonData = await commonInfo.getData();
      // console.log(data, commonData)
      setPd(data);
      setCommonData(commonData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {

    showDreeanLogo();

    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 0);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    if (isInitialized && lang && lang.sku) {
      getData();
    }
  }, [isInitialized, lang]);
  
  if (loading) {
    return <LoadingOverlay show={true} />
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
      <Header commonData={commonData?.menu ?? null} />
      <HeroSection data={pd} commonData={commonData?.hero ?? null} />
      <SkillsSection data={pd?.skills ?? null} commonData={commonData?.skills ?? null} />
      <ProjectsSection data={pd?.projects ?? null} commonData={commonData?.projects ?? null} />
      <ContactSection data={pd?.contact ?? null} commonData={commonData?.contacts ?? null} />
    </div>
  );
}