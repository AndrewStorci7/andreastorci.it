import React from "react";
import { 
    HomePage, 
    ProjectsPage, 
    ContactsPage,
    SkillsPage
} from "@apages";

import { usePageSelector } from "./provider/PageSelectorContext";
import { useCookie } from "@inc/Cookies";

interface PageSelectorProp {
    page?: string
    onChange?: Function
}

const PageSelector = ({
    page,
    onChange
}: PageSelectorProp) => {
    
    // const { setPage } = usePageSelector();
    // const [currentPage, setCurrentPage] = useCookie({ name: "page" })

    switch (page) {
        default:
        case 'home': {
            // setPage('home')
            // setCurrentPage('home')
            onChange && onChange('home')
            return <HomePage />;
        }
        case 'projects': {
            // setPage('projects')
            // setCurrentPage('projects')
            onChange && onChange('projects')
            return <ProjectsPage />;
        }
        case 'contacts': {
            // setPage('contacts')
            // setCurrentPage('contacts')
            onChange && onChange('contacts')
            return <ContactsPage />;
        }
        case 'skills': {
            // setPage('contacts')
            // setCurrentPage('skills')
            onChange && onChange('skills')
            return <SkillsPage />;
        }    
    }
}

export default PageSelector;