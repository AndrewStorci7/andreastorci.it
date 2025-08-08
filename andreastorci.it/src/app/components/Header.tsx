/**
 * Header component
 * @author Andrea Storci aka dreean
 */
'use client'

import React, { JSX, useRef, useCallback, useState, useEffect } from 'react';
import FlagChooser from '@inc/FlagChooser';
import { MenuItemsName } from '@ctypes/index';
import Icon from "@inc/Icon";
import "@style/headerStyle.css";

interface Theme {
    '--sage-green': string;
    '--soft-blue': string;
    '--accent-coral': string;
}

const themes: Theme[] = [
    {
        '--sage-green': '#9CAF88',
        '--soft-blue': '#A8C8E1',
        '--accent-coral': '#E07A5F'
    },
    {
        '--sage-green': '#7B68EE',
        '--soft-blue': '#98FB98',
        '--accent-coral': '#FFB6C1'
    },
    {
        '--sage-green': '#20B2AA',
        '--soft-blue': '#87CEEB',
        '--accent-coral': '#F0E68C'
    }
];



const Header = ({ 
    commonData 
}: { 
    commonData: MenuItemsName | null
}): JSX.Element => {
    
    const clickCountRef = useRef<number>(0);
    const lastScrollRef = useRef<number>(0);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [isHeaderVisible, setIsHeaderVisible] = useState<boolean>(true);
    const [isScrolled, setIsScrolled] = useState<boolean>(false);

    // console.log(commonData)
    
    useEffect(() => {
        const handleScroll = (): void => {
            const currentScroll = window.pageYOffset;

            if (currentScroll > lastScrollRef.current && currentScroll > 100) {
                setIsHeaderVisible(false);
                setIsMenuOpen(false);
            } else {
                setIsHeaderVisible(true);
            }

            setIsScrolled(currentScroll > 50);
            
            lastScrollRef.current = currentScroll;
        };

        let ticking = false;
        const throttledScroll = (): void => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', throttledScroll, { passive: true });
        
        return () => {
            window.removeEventListener('scroll', throttledScroll);
        };
    }, []);
    
    const changeTheme = useCallback((theme: Theme): void => {
        const root = document.documentElement;
        
        Object.entries(theme).forEach(([property, value]) => {
            root.style.setProperty(property, value);
        });
    }, []);

    const showNotification = useCallback((message: string): void => {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--sage-green);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            z-index: 10000;
            font-family: 'Inter', sans-serif;
            font-weight: 500;
            font-size: 0.95rem;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
            transform: translateX(100%);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            backdrop-filter: blur(10px);
        `;
        
        document.body.appendChild(notification);
        
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });

        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }, []);

    // Easter egg: cambio tema con 5 click
    const handleLogoClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>): void => {
        e.preventDefault();
        clickCountRef.current++;
        
        if (clickCountRef.current >= 5) {
            const randomTheme = themes[Math.floor(Math.random() * themes.length)];
            
            changeTheme(randomTheme);
            
            clickCountRef.current = 0;
            
            showNotification('🎨 Tema cambiato!');
        } else if (clickCountRef.current === 3) {
            showNotification(`🎯 Ancora ${5 - clickCountRef.current} click...`);
        }
    }, [changeTheme, showNotification]);

    const toggleMenu = useCallback((): void => {
        setIsMenuOpen(prev => !prev);
    }, []);

    const handleNavLinkClick = useCallback((): void => {
        setIsMenuOpen(false);
    }, []);

    const handleSmoothScroll = useCallback((e: React.MouseEvent<HTMLAnchorElement>, targetId: string): void => {
        e.preventDefault();
        
        const targetElement = document.getElementById(targetId.substring(1)); // Rimuovi il #
        if (targetElement) {
            const headerHeight = 80;
            const elementPosition = targetElement.offsetTop;
            const offsetPosition = elementPosition - headerHeight;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }

        handleNavLinkClick();
    }, [handleNavLinkClick]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent): void => {
            if (e.key === 'Escape' && isMenuOpen) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isMenuOpen]);

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMenuOpen]);

    return (
        <header 
            className={`
                ${!isHeaderVisible ? 'header-hidden' : ''} 
                ${isScrolled ? 'header-scrolled' : ''}
            `}
        >
            <nav className="container">
                <a 
                    href="#home" 
                    className="logo"
                    onClick={handleLogoClick}
                    aria-label="Andrea Storci - Torna alla home (click 5 volte per cambiare tema)"
                    title="Click 5 volte per cambiare tema 🎨"
                >
                    AS
                </a>

                <ul className={`nav-links ${isMenuOpen ? 'mobile-open' : ''}`}>
                    <li>
                        <FlagChooser />
                    </li>
                    <li>
                        <a 
                            href="#home"
                            onClick={(e) => handleSmoothScroll(e, '#home')}
                        >
                            {commonData?.home}
                        </a>
                    </li>
                    <li>
                        <a 
                            href="#skills"
                            onClick={(e) => handleSmoothScroll(e, '#skills')}
                        >
                            {commonData?.skills}
                        </a>
                    </li>
                    <li>
                        <a 
                            href="#projects"
                            onClick={(e) => handleSmoothScroll(e, '#projects')}
                        >
                            {commonData?.projects}
                        </a>
                    </li>
                    <li>
                        <a 
                            href="#contact"
                            onClick={(e) => handleSmoothScroll(e, '#contact')}
                        >
                            {commonData?.contact}
                        </a>
                    </li>
                </ul>

                {/* Hamburger menu per mobile */}
                <button 
                    className={`hamburger ${isMenuOpen ? 'active' : ''}`}
                    onClick={toggleMenu}
                    // aria-label={isMenuOpen ? 'Chiudi menu di navigazione' : 'Apri menu di navigazione'}
                    aria-expanded={isMenuOpen}
                    type="button"
                >
                    <Icon useFor="hamburger" className="hamburger-icon" />
                </button>
            </nav>

            {/* Overlay per menu mobile */}
            {isMenuOpen && (
                <div 
                    className="menu-overlay"
                    onClick={() => setIsMenuOpen(false)}
                    aria-hidden="true"
                />
            )}
        </header>
    );
}

export default Header