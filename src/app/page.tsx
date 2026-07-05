'use client'
import PersonalInfo, { PersonalData } from "@ctypes/PersonalInfo";
import ContactSection from "@components/sections/ContactSection";
import SkillsSection from "@components/sections/SkillSection";
import ProjectsSection from "@components/sections/Projects";
import { useFadeInObserver } from "@inc/animated/FadeIn";
import HeroSection from "@components/sections/Hero";
import React, { useState, useEffect } from "react";
import LoadingOverlay from "@inc/animated/Loader";
import { CommonData } from "@ctypes/CommonInfo";
import { showDreeanLogo } from "@inc/ANSI";
import { useCookie } from "@inc/Cookies";
import Header from "@components/Header";
import Footer from "@components/Footer";
import Section from "@inc/Section";

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
      // const commonInfo = new CommonInfo(lang.sku);
      const data = await personalInfo.getPersonalData();
      const commonData = await personalInfo.getCommonInfos();
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
      <Header commonData={commonData?.menu_section ?? null} />
      <HeroSection data={pd} commonData={commonData?.hero_section ?? null} />
      <SkillsSection data={pd?.skills ?? null} commonData={commonData?.skills_section ?? null} />
      <ProjectsSection data={pd?.projects ?? null} commonData={commonData?.projects_section ?? null} />
      <ContactSection data={pd?.contact ?? null} commonData={commonData?.contacts_section ?? null} />
      <Footer />
    </div>
  );
}