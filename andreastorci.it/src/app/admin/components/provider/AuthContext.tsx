'use client';
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { ResponseFromAPI } from '@ctypes';

export type UserType = {
    id: string;
    name?: string;
    surname: string;
};

type AuthContextType = {
    user: UserType | null;
    setUser: (user: UserType) => void;
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
    const [user, setUser] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const response = await fetch('/api/auth/verify', {
                method: 'POST',
                credentials: 'include', // Include cookies
            });

            if (response.ok) {
                const data: ResponseFromAPI = await response.json();
                if (!data.success) {
                    setError(data.error || "")
                } else {
                    setUser(data.data.user);
                }
            } else {
                setError("Errore durante la validazione dei token di accesso! Token scaduto o errato")
                router.push('/admin/login');
            }
        } catch (error) {
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

// 'use client'
// import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
// import { usePageSelector } from "./PageSelectorContext";
// import { useRouter } from "next/navigation";
// import Cookies from 'js-cookie';

// type UserType = {
//     name?: string,
//     surname: string,
//     dataAccess?: Date,
//     dataExpire?: Date
// }

// type AuthContextType = {
//     user: UserType;
//     setUser: (user: UserType) => void;
// };

// const AuthContext = createContext<AuthContextType | null>(null);

// export const useAuth = () => {
//     const context = useContext(AuthContext);
//     if (!context) {
//         throw new Error('useAuth must be used within a AuthProvider');
//     }
//     return context;
// };

// export const AuthProvider = ({ children }: { children: ReactNode }) => {

//     const router = useRouter()
//     const { setLoader } = usePageSelector()
//     const token = Cookies.get('token');
//     const [user, setUser] = useState<UserType>({
//         name: '', 
//         surname: '', 
//         dataAccess: new Date(), 
//         dataExpire: new Date()
//     })

//     const checkIfAlreadyLogged = async () => {
//         if (token) {
//             const req = await fetch('/api/auth/login', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ type: 'check', token })
//             })
//             const res = await req.json();
//             if (!res.success) {
//                 console.log("login effettuato")
//                 router.push('/admin/login')
//             } else {
//                 router.push('/admin')
//             }
//         } else {
//             router.push('/admin/login')
//         }
//     }

//     useEffect(() => {
//         try {
//             setLoader(true);
//             checkIfAlreadyLogged()
//         } catch (err) {
//             console.error(err)
//         } finally {
//             setLoader(false);
//         }
//     }, []);

//     return (
//         <AuthContext.Provider value={{ user, setUser }}>
//             {children}
//         </AuthContext.Provider>
//     );
// }

// // export const useAuth = () => useContext(AuthContext);