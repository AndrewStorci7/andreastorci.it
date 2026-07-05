'use client'
import { useCookie } from "@inc/Cookies";
import React, { useState } from "react";
import "@style/flagChooserStyle.css";
import Image from "next/image";

const FlagChooser = () => {

    const [language, setLanguage] = useCookie({ name: 'language' });

    const handleLanguageChange = (lang: string) => {
        chooseLanguage(lang);
        setShow(false);
        window.location.reload();
    };

    const chooseLanguage = (lang: string) => {
        switch (lang) {
            case "it-IT":
                setLanguage({ sku: 'it-IT', id: 'IT', name: 'Italiano', flag: '/flags/it.png' });
                break;
            case "es-ES":
                setLanguage({ sku: 'es-ES', id: 'ES', name: 'Español', flag: '/flags/es.png' });
                break;
            case "en-US":
            default:
                setLanguage({ sku: 'en-GB', id: 'EN', name: 'English', flag: '/flags/engb.png' });
                break;
        }
    }

    const [show, setShow] = useState<boolean>(false);
    const showMenu = () => {
        setShow(prev => !prev);
    }

    return (
        <div className="relative">
            <div className="flag-chooser-mobile -border-flags">
                <a className="" href="#" onClick={showMenu}>
                    <Image width={25} height={25} src={language.flag || '/flags/it.png'} alt={language.name || 'Italiano'} />
                    <span>{language.id || 'IT'}</span>
                </a>
            </div>
            {show && (
                <ul className="flag-chooser border-flags">
                    <li>
                        <a className="" href="#" onClick={() => handleLanguageChange('it-IT')}>
                            <Image width={25} height={25} src="/flags/it.png" alt="Italian Flag" />
                            <span>IT</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" onClick={() => handleLanguageChange('en-US')}>
                            <Image width={25} height={25} src="/flags/engb.png" alt="English Flag" />
                            <span>EN (UK)</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" onClick={() => handleLanguageChange('es-ES')}>
                            <Image width={25} height={25} src="/flags/es.png" alt="Spanish Flag" />
                            <span>ES</span>
                        </a>
                    </li>
                </ul>
            )}
        </div>
    );
};

export default FlagChooser;
