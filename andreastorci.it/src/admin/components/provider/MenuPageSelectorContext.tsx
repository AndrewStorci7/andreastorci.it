'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import LoadingOverlay from '@inc/animated/Loader';
import Cookies from 'js-cookie';
import hash from 'string-hash';

type PageState = {
    menuId: string;
    page: string;
    sku?: string;
    // onClick?: MouseEventHandler<HTMLButtonElement>
    showLoader?: boolean
};

type PageSelectorContextType = {
    currentState: PageState;
    setSku: (sku: string) => void;
    setPage: (sku: string, page: string) => void;
    setLoader: (value: boolean) => void;
};

const MenuPageSelectorContext = createContext<PageSelectorContextType | null>(null);

export const useMenuPageSelector = () => {
    const context = useContext(MenuPageSelectorContext);
    if (!context) {
        throw new Error('useMenuPageSelector must be used within a MenuPageSelectorProvider');
    }
    return context;
};


interface MenuProviderProps {
    children: ReactNode,
    menu?: ReactNode
}

export const MenuPageSelectorProvider = ({ children, menu }: MenuProviderProps) => {
        
    const menuId = String(hash("simple-menu"));
    const page = Cookies.get(menuId) ?? 'home'

    const [currentState, setCurrentState] = useState<PageState>({
        menuId: menuId,
        page: page,
        sku: "simple-menu",
        showLoader: false,
    });

    const setSku = (sku: string) => {
        if (sku && sku !== "") {
            setCurrentState(prev => ({
                ...prev,
                sku
            }))
        }
    }

    const setPage = (menuId: string, page: string) => {
        const _menuId = String(hash(menuId));
        // const _page = Cookies.get(_menuId) ?? 'home'

        setCurrentState((prev) => {
            if (prev.page !== page) {
                Cookies.set(_menuId, page);
                return { ...prev, page };
            }
            return prev;
        });
    };

    const setLoader = (value: boolean) => {
        setCurrentState(prev => {
            return {
                ...prev,
                showLoader: value
            }
        });
    }

    return (
        <MenuPageSelectorContext.Provider value={{ currentState, setPage, setLoader, setSku }}>
            {menu}
            {children}
            <LoadingOverlay show={currentState.showLoader ?? false} />
        </MenuPageSelectorContext.Provider>
    );
};