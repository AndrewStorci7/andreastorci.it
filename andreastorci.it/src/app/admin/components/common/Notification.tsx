import { Button, NotificationPurpose, NOTIFICATIONS_PURPOSES, NOTIFICATIONS_TYPES, NotificationsTypes } from "@ctypes/index";
import React, { ReactNode, useEffect, useState } from "react";
import "@astyle/notificationStyle.css"
import Icon from "@/inc/Icon";

const Notification = ({
    debug = false,
    show = false,
    content,
    purpose,
    type,
    className,
    onClose
}: {
    debug?: boolean
    content: { 
        title?: string, 
        message?: string | ReactNode, 
        reactNode?: ReactNode | null, 
        customIcon?: ReactNode | null, 
        duration?: number
        buttons?: Button[]
    },
    show?: boolean,
    purpose: NotificationPurpose,
    type: NotificationsTypes,
    className?: string,
    onClose?: (e: boolean) => void
}) => {
    
    // const [show, setShow] = useState<boolean>(false)
    const [textColor, setTextColor] = useState<NotificationsTypes>();
    const [bgColor, setBgColor] = useState<NotificationsTypes>();
    const [rnode, setRnode] = useState<ReactNode | null>()

    const renderByPurpose = (purpose: NotificationPurpose) => {
        if (!purpose || !NOTIFICATIONS_PURPOSES.includes(purpose)) {
            throw new Error(`type non valido. Può essere solo uno di: ${NOTIFICATIONS_PURPOSES.join(', ')}`)
        }
        
        switch (purpose) {
            case "alert": {
                return (
                    <div className={`alert-container mozilla-font ${show ? "show" : ""}`}>
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
                    <div className={`notification mozilla-font ${show || debug ? "show-notification" : ""} bg-${bgColor}`}>
                        {rnode}
                    </div>
                )
            }
        }
    }

    const renderByType = (type: NotificationsTypes, content: any) => {
        if (!type || !NOTIFICATIONS_TYPES.includes(type)) {
            throw new Error(`type non valido. Può essere solo uno di: ${NOTIFICATIONS_TYPES.join(', ')}`)
        }

        setBgColor(type);
        setTextColor(type);
        setRnode(
            <div className={`flex ${purpose === "notification" ? "row" : "column"}`}>
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
            const _duration = !content.duration || content.duration <= 0 ? 5000 : content.duration;
            const interval = setInterval(() => {
                onClose && onClose(false)
            }, _duration);

            return () => clearInterval(interval);
        }
    }, [show])

    useEffect(() => {
        renderByType(type, content)
    }, [show, purpose])

    return renderByPurpose(purpose)
}

export default Notification;