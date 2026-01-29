import { Button, NotificationPurpose, NOTIFICATIONS_PURPOSES, NOTIFICATIONS_TYPES, NotificationsTypes } from "@ctypes";
import React, { ReactNode, useEffect, useState } from "react";
import "@astyle/notificationStyle.css"
import Icon from "@/inc/Icon";
import { useNotification } from "../provider";

type NotificationContent = {
    title?: string, 
    message?: string | ReactNode, 
    reactNode?: ReactNode | null, 
    customIcon?: ReactNode | null, 
    duration?: number
    buttons?: Button[]
}

const Notification = ({
    debug = false,
    show = false,
    content,
    purpose,
    type,
    onClose
}: {
    debug?: boolean
    content: NotificationContent,
    show?: boolean,
    purpose: NotificationPurpose,
    type: NotificationsTypes,
    onClose?: (e: boolean) => void
}) => {
    
    const { hideNotification } = useNotification();
    // const [show, setShow] = useState<boolean>(false)
    const [, setTextColor] = useState<NotificationsTypes>();
    const [bgColor, setBgColor] = useState<NotificationsTypes>();
    const [rnode, setRnode] = useState<ReactNode | null>()

    const renderByPurpose = (purpose: NotificationPurpose) => {
        if (!purpose || !NOTIFICATIONS_PURPOSES.includes(purpose)) {
            throw new Error(`type non valido. Può essere solo uno di: ${NOTIFICATIONS_PURPOSES.join(', ')}`)
        }
        
        switch (purpose) {
            case "alert": {
                return (
                    <div 
                    onClick={() => hideNotification()}
                    className={`alert-container mozilla-font ${show ? "show" : ""}`}
                    >
                        <div className={`alert ${show ? "show-alert" : ""} bg-${bgColor}`}>
                            <a className="close-button" onClick={() => onClose && onClose(false)}>
                                <Icon width={25} height={25} useFor="close" />
                            </a>
                            {rnode}
                            {content?.buttons && (
                                <div className="button-container">
                                    {content.buttons.map((val, index) => (
                                        <button key={index} className={`mozilla-font button-${val.type}`} onClick={val.onClick}>
                                            {val.text}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )
            }
            default:
            case "notification": {
                return (
                    <div 
                    onClick={() => hideNotification()}
                    className={`notification mozilla-font ${show || debug ? "show-notification" : ""} bg-${bgColor}`}
                    >
                        {rnode}
                    </div>
                )
            }
        }
    }

    const renderByType = (type: NotificationsTypes, content: NotificationContent) => {
        if (!type || !NOTIFICATIONS_TYPES.includes(type)) {
            throw new Error(`type non valido. Può essere solo uno di: ${NOTIFICATIONS_TYPES.join(', ')}`)
        }

        setBgColor(type);
        setTextColor(type);
        setRnode(
            <div className={`text-black flex ${purpose === "notification" ? "row" : "column"}`}>
                {purpose === "notification" && (
                    <div className="m-r-2 m-t-1">
                        {content?.customIcon}
                    </div>
                )}
                <div>
                    <div className={`flex items-center gap-4 title text-${type}`}>{purpose !== "notification" && content?.customIcon}{content?.title}</div>
                    <div className={`description ${purpose !== "notification" ? "fix-padding" : ""}`}>{content?.message}</div>
                </div>
            </div>
        )
    }

    useEffect(() => {
        if (purpose === "notification") {
            if (content.duration && content.duration > 0) {
                const interval = setInterval(() => {
                    onClose?.(false)
                }, content.duration);
    
                return () => clearInterval(interval);
            }
        }
    }, [show])

    useEffect(() => {
        renderByType(type, content)
    }, [show, purpose])

    return renderByPurpose(purpose)
}

export default Notification;