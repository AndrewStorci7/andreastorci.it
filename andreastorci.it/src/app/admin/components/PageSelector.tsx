'use client'
import React, { useState, useEffect } from "react";
import { 
    HomePage, 
    ProjectsPage, 
    ContactsPage,
    SkillsPage,
    Settings
} from "@apages";

import NewsWrapper from "./edit/home/NewsWrapper";
import { usePageSelector } from "@providers";

interface PageSelectorProp {
    page?: string
    onChange?: Function
}

const PageSelector = ({
    page = "home",
    onChange
}: PageSelectorProp) => {
    
    const { currentPage } = usePageSelector();
    // const [currentPage, setCurrentPage] = useCookie({ name: "page" })
    const [title, setTitle] = useState<string>()

    useEffect(() => {
        switch (page) {
            default:
            case 'home':
                setTitle("Homepage");
                onChange?.('home');
                break;
            case 'projects':
                setTitle("I Tuoi Progetti");
                onChange?.('projects');
                break;
            case 'contacts':
                setTitle("Contatti");
                onChange?.('contacts');
                break;
            case 'skills':
                setTitle("Competenze");
                onChange?.('skills');
                break;
            case 'settings':
                setTitle("Impostazioni");
                onChange?.('settings');
                break;
        }
    }, [page, onChange]);

    const renderPage = (page: string | null) => {
        switch (page) {
            default:
            case 'home': return <HomePage />;
            case 'projects': return <ProjectsPage />;
            case 'contacts': return <ContactsPage />;
            case 'skills': return <SkillsPage />;
            case 'settings': return <Settings />;
        }
    };

    return (
        <>
            <div className="titlepage inline-flex gap-4 items-center">
                <h1>{currentPage.title}</h1>
                {currentPage.subtitle && <h3>- {currentPage.subtitle}</h3>}
            </div>
            <div className="min-h-300px">
                <NewsWrapper className="center" />
            </div>
            {renderPage(page)}
        </>
    )
}

export default PageSelector;