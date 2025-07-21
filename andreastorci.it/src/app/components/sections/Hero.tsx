/**
 * Hero Section Component
 * @author Andrea Storci aka dreean
 */
'use client'

import React from 'react';
import Section from '@components/inc/Section';
import { PersonalData } from '@/types/PersonalInfo';

const HeroSection = ({ data }: { data: PersonalData | null }) => {

    return (
        <Section home={true} id='home' className='hero'>
            <div className="hero-content">
                <div className="hero-text fade-in">
                    <h1>{data?.name} {data?.surname}</h1>
                    <p className="subtitle">{data?.title}</p>
                    <p className="bio">{data?.bio}</p>
                    
                    <div className="cta-buttons">
                        <a href="#projects" className="btn btn-primary">Visualizza Progetti</a>
                        <a href="#contact" className="btn btn-secondary">Contattami</a>
                    </div>
                </div>
                
                <div className="hero-visual fade-in">
                    <div className="profile-card">
                        <div className="profile-image">
                            {data?.avatar ? (
                                <img src={data.avatar} alt={`${data.name} ${data.surname}`} />
                            ) : (
                                `${data?.name?.[0]}${data?.surname?.[0]}`
                            )}
                        </div>
                        <h3>{data?.name} {data?.surname}</h3>
                        <p>{data?.title}</p>
                        <p>{data?.contact?.location}</p>
                    </div>
                    
                    <div className="floating-element">
                        <div className="geometric-shape"></div>
                    </div>
                    <div className="floating-element">
                        <div className="geometric-shape circle"></div>
                    </div>
                    <div className="floating-element">
                        <div className="geometric-shape triangle"></div>
                    </div>
                </div>
            </div>
        </Section>
    )
}

export default HeroSection;