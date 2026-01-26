'use client'
import { usePageSelector } from "@providers";
import React from "react";

import "@astyle/sidebarStyle.css"
import { version } from "../../../../package.json";

const SideBar = () => {

    const { setPage } = usePageSelector();
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
                <div>
                    <label htmlFor="menu-content">Content</label>
                    <div id="menu-content" className="flex column menu-item menu-content">
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