'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import LoadingOverlay from '@inc/animated/Loader';
import Cookies from 'js-cookie';

type PageState = {
    page: string;
    showLoader?: boolean
};

type PageSelectorContextType = {
    currentState: PageState;
    setPage: (page: string) => void;
    setLoader: (value: boolean) => void;
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
        
    const [currentState, setCurrentState] = useState<PageState>({
        page: Cookies.get("page") ?? 'home',
        showLoader: false,
    });

    const setPage = (page: string) => {
        setCurrentState((prev) => {
            if (prev.page !== page) {
                Cookies.set("page", page);
                return { ...prev, page };
            }
            return prev;
        });
    };

    const setLoader = (value: boolean) => {
        console.log("before setLoader(): ", currentState)
        console.log("val: ", value)
        setCurrentState(prev => {
            return {
                ...prev,
                showLoader: value
            }
        });
        console.log("after setLoader(): ", currentState)
    }

    return (
        <PageSelectorContext.Provider value={{ currentState, setPage, setLoader }}>
            {children}
            <LoadingOverlay show={currentState.showLoader ?? false} />
        </PageSelectorContext.Provider>
    );
};