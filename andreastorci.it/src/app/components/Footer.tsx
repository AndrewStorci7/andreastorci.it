/**
 * Footer component
 * @author Andrea Storci aka dreean
 */
import React from 'react'
import '@style/footerStyle.css'
import { version } from "../../../package.json";

export default function Footer() {

    const currentYear = new Date().getFullYear();

    return (
        <div className='footer-section center'>
            Copyright © 2025-{currentYear} andreastorci.it | v{version}
        </div>
    )
}