/**
 * Loading component with animation
 * @author Andrea Storci aka dreean 
 * @param {Function} onLoadingComplete Funzione di callback 
 * @returns 
 */
'use client'
import React, { useState, useEffect } from 'react';

interface LoadingOverlayProps {
    onLoadingComplete?: () => void;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ onLoadingComplete }) => {
    
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const handleLoad = () => {
            setTimeout(() => {
                setIsLoading(false);
                onLoadingComplete?.();
            }, 1000);
        };

        if (document.readyState === 'complete') {
            handleLoad();
        } else {
            window.addEventListener('load', handleLoad);
        }

        return () => {
            window.removeEventListener('load', handleLoad);
        };
    }, [onLoadingComplete]);

    if (!isLoading) return null;

    return (
        <div className={`loading-overlay ${!isLoading ? 'hidden' : ''}`}>
            <div className="loader"></div>
        </div>
    );
};

export default LoadingOverlay;