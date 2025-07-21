/**
 * Header component
 * @author Andrea Storci aka dreean
 */
'use client'

import Icon from "@components/inc/icon";

export default function Header() {

    return (
        <header>
            <nav className="container">
                <a href="#home" className="logo">AS</a>
                <ul className="nav-links">
                    <li><a href="#home">Home</a></li>
                    <li><a href="#skills">Skills</a></li>
                    <li><a href="#projects">Projects</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
            </nav>
        </header>
    )
}
