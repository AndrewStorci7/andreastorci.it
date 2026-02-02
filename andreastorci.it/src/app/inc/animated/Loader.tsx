/**
 * Loading component with animation
 * @author Andrea Storci aka dreean 
 * @param {Function} onLoadingComplete Funzione di callback 
 * @returns 
 */
'use client'
import React from 'react';

interface LoadingOverlayProps {
    onLoadingComplete?: () => void;
    show: boolean,
    text?: string
}

const LoadingOverlay = ({ 
    show,
    text = "" 
}: LoadingOverlayProps) => {
    return (
        <div className={`loading-overlay flex center column ${!show ? 'hidden' : ''}`}>
            <div className="loader"></div>
            <p>{text}</p>
        </div>
    );
};

export default LoadingOverlay;