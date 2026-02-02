'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import LoadingOverlay from '@inc/animated/Loader';
import Cookies from 'js-cookie';
import { jsonParseCookie } from '@/admin/inc/functions';

type PageState = {
    page: string;
    title: string;
    subtitle?: string
    showLoader?: boolean
};

type PageSelectorContextType = {
    currentPage: PageState;
    setPage: (page: string, title: string, subtitle?: string) => void;
    setLoader: (value: boolean) => void;
    setTitle: (title: string) => void;
    setSubTitle: (subtitle: string) => void; 
};

const PageSelectorContext = createContext<PageSelectorContextType | null>(null);

export const usePageSelector = () => {
    const context = useContext(PageSelectorContext);
    if (!context) {
        throw new Error('usePageSelector must be used within a PageSelectorProvider');
    }
    return context;
};

export const PageSelectorProvider = ({ children }: { children: ReactNode }) => {
        
    const cookie = jsonParseCookie("page")
    const [currentState, setCurrentState] = useState<PageState>({
        page: cookie?.page,
        title: cookie?.title,
        subtitle: cookie?.subtitle,
        showLoader: false,
    });

    const setPage = (page: string, title: string, subtitle?: string) => {
        setCurrentState((prev) => {
            if (prev.page !== page) {
                Cookies.set("page", JSON.stringify({ page, title, subtitle }));
                return { ...prev, page, title, subtitle };
            }
            return prev;
        });
    };

    const setTitle = (title: string) => {
        setCurrentState((prev) => {
            return { 
                ...prev,
                title, 
            };
        });
    }

    const setSubTitle = (subtitle: string) => {
        setCurrentState((prev) => {
            return { 
                ...prev,
                subtitle, 
            };
        });
    }

    const setLoader = (value: boolean) => {
        setCurrentState(prev => {
            return {
                ...prev,
                showLoader: value
            }
        });
    }

    return (
        <PageSelectorContext.Provider 
            value={{ 
                currentPage: currentState, 
                setPage, 
                setLoader, 
                setTitle, 
                setSubTitle 
            }}
        >
            {children}
            <LoadingOverlay show={currentState.showLoader ?? false} />
        </PageSelectorContext.Provider>
    );
};