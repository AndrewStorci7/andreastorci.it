import React from 'react'

export default function Footer() {

    const currentYear = new Date().getFullYear();

    return (
        <div className='footer-section center'>
            Copyright © 2025-{currentYear} andreastorci.it | v{process.env.ADMIN_CMS_VERSION}
        </div>
    )
}
