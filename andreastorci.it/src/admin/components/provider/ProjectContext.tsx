'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

type PageState = {
    type: "list" | "preview";
};

type ProjectContextType = {
    currentState: PageState;
    switchType: () => void;
};

const ProjectContext = createContext<ProjectContextType | null>(null);

export const useProjectContext = () => {
    const context = useContext(ProjectContext);
    if (!context) {
        throw new Error('useProjectContext must be used within a ProjectProvider');
    }
    return context;
};

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
    const [currentState, setCurrentState] = useState<PageState>({
        type: 'list'
    });

    const switchType = () => {
        setCurrentState((prev) => {
            if (prev.type == 'list') {
                return { ...prev, type: 'preview' };
            } else {
                return { ...prev, type: 'list' };
            }
        });
    }

    return (
        <ProjectContext.Provider value={{ currentState, switchType }}>
            {children}
        </ProjectContext.Provider>
    )
}