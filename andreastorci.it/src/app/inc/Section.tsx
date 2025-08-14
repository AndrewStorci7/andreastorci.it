import React, { ReactNode } from 'react'

interface SectionProps {
    preview?: boolean;
    children: ReactNode;
    home?: boolean;
    id: string;
    className: string;
    title?: string;
}

const Section: React.FC<SectionProps> = ({
    preview = false,
    children, 
    home = false, 
    id, 
    className,
    title
}) => {
    return (
        <section id={id} className={`${className} ${preview ? "fix-for-preview" : ""}`}>
            <div className="container">
                {!home && <h2 className="section-title fade-in">{title}</h2>}
                {children}
            </div>
        </section>
    )
}

export default Section;