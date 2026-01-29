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
    show: boolean
}

const LoadingOverlay = ({ show }: LoadingOverlayProps) => {
    return (
        <div className={`loading-overlay ${!show ? 'hidden' : ''}`}>
            <div className="loader"></div>
        </div>
    );
};

export default LoadingOverlay;