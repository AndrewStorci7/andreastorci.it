'use client'
import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { usePageSelector } from "./PageSelectorContext";
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';

type UserType = {
    name?: string,
    surname: string,
    dataAccess?: Date,
    dataExpire?: Date
}

type AuthContextType = {
    user: UserType;
    setUser: (user: UserType) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within a AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {

    const router = useRouter()
    const { setLoader } = usePageSelector()
    const token = Cookies.get('token');
    const [user, setUser] = useState<UserType>({
        name: '', 
        surname: '', 
        dataAccess: new Date(), 
        dataExpire: new Date()
    })

    const checkIfAlreadyLogged = async () => {
        if (token) {
            const req = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'check', token })
            })
            const res = await req.json();
            if (!res.success) {
                router.push('/admin/login')
            } else {
                router.push('/admin')
            }
        } else {
            router.push('/admin/login')
        }
    }

    useEffect(() => {
        try {
            setLoader(true);
            checkIfAlreadyLogged()
        } catch (err) {
            console.error(err)
        } finally {
            setLoader(false);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

// export const useAuth = () => useContext(AuthContext);