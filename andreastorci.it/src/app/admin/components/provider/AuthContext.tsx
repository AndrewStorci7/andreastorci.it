'use client';
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { ResponseFromAPI, User } from '@ctypes';

type AuthContextType = {
    user: User | null;
    setUser: (user: User) => void;
    logout: () => void;
    error: string | null,
    setError: (err: string | null) => void
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const response = await fetch('/api/auth/verify', {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                const data: ResponseFromAPI = await response.json();

                if (data.user) {
                    setUser(data.user || null);
                }
            } else {
                setError("Errore durante la validazione dei token di accesso! Token scaduto o errato")
                router.push('/admin/login');
            }
        } catch (error) {
            console.error(error);
            router.push('/admin/login');
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });
            setUser(null);
            router.push('/admin/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ error, setError, user, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};