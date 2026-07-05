'use client'
import { version } from "../../../../package.json";
import { useAuth, usePageSelector } from "@providers";
import { LogOut } from 'lucide-react';
import "@astyle/sidebarStyle.css";
import Image from "next/image";
import React from "react";


const SideBar = () => {

    const { user, logout } = useAuth();
    const { setPage, setLoader } = usePageSelector();
    const currentYear = new Date().getFullYear();
    
    return (
        <div className="full-h sidebar flex column">
            <div className="header column center">
                <a 
                    href="#home" 
                    className="logo"
                    onClick={() => setPage('home', "Homepage")}
                >
                    AS
                </a>
                <p className="fix-position">Admin panel</p>
            </div>
            <div className="menu gap-max flex column">

                {/* Content section */}
                <div>
                    <label htmlFor="menu-content">Content</label>
                    <div id="menu-content" className="flex column menu-item menu-content relative">
                        <a id="menu-projects" className="submenu-item menu-projects" onClick={() => setPage('projects', "Progetti")}>
                            Progetti
                        </a>
                        <a id="menu-projects" className="submenu-item menu-projects" onClick={() => setPage('contacts', "Contatti")}>
                            Contatti
                        </a>
                        <a id="menu-projects" className="submenu-item menu-projects" onClick={() => setPage('skills', "Competenze")}>
                            Skills
                        </a>
                    </div>
                </div>

                {/* Settings section */}
                <div>
                    <label htmlFor="menu-settings">Settings</label>
                    <div id="menu-settings" className="flex column menu-item menu-settings">
                        <a id="menu-projects" className="submenu-item menu-projects" onClick={() => setPage('settings', "Impostazioni")}>
                            Impostazioni
                        </a>
                        <a id="menu-projects" className="submenu-item menu-projects" onClick={() => setPage('account', "Account")}>
                            Account
                        </a>
                        <a id="menu-projects" className="submenu-item menu-projects" onClick={() => setPage('info', "Informazioni")}>
                            Informazioni
                        </a>
                    </div>
                </div>

                {/* Section for profile */}
                <div>
                    <label htmlFor="menu-profile">Profile</label>
                    <div id="menu-profile" className="menu-profile-container">
                        <div className="menu-item-wrapper">
                            {/* Profile information - Stato Iniziale */}
                            <div className="profile-info-part flex row gap-3 items-center">
                                <div className="avatar flex align-center">
                                    <Image 
                                        src={"/social/default-avatar.webp"} 
                                        height={30} 
                                        width={30}
                                        alt="default-avatar"
                                        className="avatar"
                                    />
                                </div>
                                <div className="flex center text-black bold text-sm">
                                    {user?.name}
                                </div>
                            </div>

                            {/* Logout - Stato al passaggio del mouse */}
                            <div 
                            className="logout-part flex row gap-3 items-center"
                            onClick={() => {
                                logout();
                                setLoader(true);
                            }}
                            >
                                <div className="flex align-center">
                                    <LogOut size={20} />
                                </div>
                                <div className="flex center text-black bold text-sm">
                                    Logout
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="margin-t-auto version-footer">
                <div className="">
                    <span>Copyright © 2025-{currentYear}</span><br/>
                    <span>andreastorci.it | v{version}</span>
                </div>
            </div>
        </div>
    )
}

export default SideBar;