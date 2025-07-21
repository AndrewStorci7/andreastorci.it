import { useState, useEffect } from 'react';

interface CookieProps {
    name: string;
    defaultValue?: any;
}

function useCookie({name, defaultValue = ''}: CookieProps): [any, (value: any, days?: number) => void, () => void] {
    // Inizializza sempre con defaultValue, mai con document
    const [value, setValue] = useState(defaultValue);
    const [isInitialized, setIsInitialized] = useState(false);

    // useEffect per inizializzare il valore del cookie solo lato client
    useEffect(() => {
        // Verifichiamo che siamo lato client e non abbiamo già inizializzato
        if (typeof window !== 'undefined' && !isInitialized) {
            try {
                const cookie = document.cookie
                    .split('; ')
                    .find(row => row.startsWith(name + '='));
                
                if (cookie) {
                    try {
                        // Prova a fare il parse del JSON (per oggetti)
                        const cookieValue = decodeURIComponent(cookie.split('=')[1]);
                        const parsedValue = JSON.parse(cookieValue);
                        setValue(parsedValue);
                    } catch (error) {
                        // Se non è un JSON valido, usa il valore come stringa
                        setValue(decodeURIComponent(cookie.split('=')[1]));
                    }
                }
                setIsInitialized(true);
            } catch (error) {
                setIsInitialized(true);
            }
        }
    }, [name, defaultValue, isInitialized]);

    const updateCookie = (newValue: any, days = 7) => {
        if (typeof window === 'undefined') return; // Protezione SSR
        
        setValue(newValue);
        
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        
        // Serializza l'oggetto se necessario
        const serializedValue = typeof newValue === 'object' 
            ? encodeURIComponent(JSON.stringify(newValue))
            : encodeURIComponent(newValue);
            
        document.cookie = `${name}=${serializedValue};expires=${expires.toUTCString()};path=/`;
    };

    const deleteCookie = () => {
        if (typeof window === 'undefined') return; // Protezione SSR
        
        setValue(defaultValue);
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    };

    return [value, updateCookie, deleteCookie];
}

export { useCookie };