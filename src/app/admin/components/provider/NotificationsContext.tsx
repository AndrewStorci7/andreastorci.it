'use client'
import React, { createContext, useContext, useState, ReactNode } from "react"
import { NotificationType } from "@ctypes";
import Notification from "@common/Notification";

type NotificationsContextType = {
    notification: NotificationType;
    showNotification: (newVal: NotificationType) => void;
    hideNotification: () => void;
    // setType: (type: NotificationsTypes) => void;
    // setTitle: (title: string) => void;
    // setMessage: (title: string) => void;
    // setTitle: (title: string) => void;
}

const NotificationsContext = createContext<NotificationsContextType | null>(null);

export const useNotification = () => {
    const context = useContext(NotificationsContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationsProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {

    const [notification, setNotification] = useState<NotificationType>({
        show: false,
    })

    const showNotification = (newVals: NotificationType) => {
        setNotification(prev => ({
            ...prev,
            ...newVals,
            show: true
        }))
    }

    const hideNotification = () => {
        setNotification(prev => ({
            ...prev,
            show: false
        }))
    }
    
    return (
        <NotificationsContext.Provider value={{ notification, showNotification, hideNotification }}>
            {children}
            <Notification 
                show={notification.show} 
                content={{ 
                    title: notification.title,
                    message: notification.message,
                    customIcon: notification.customIcon,
                    duration: notification.duration,
                    buttons: notification.buttons
                }} 
                purpose={notification.purpose ?? "notification"}
                type={notification.type ?? "info"}
                onClose={hideNotification}
            />
        </NotificationsContext.Provider>
    )
}