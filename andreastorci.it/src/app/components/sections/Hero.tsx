/**
 * Hero Section Component
 * @author Andrea Storci aka dreean
 */
'use client'

import React from 'react';
import Section from '@inc/Section';
import { PersonalData } from '@ctypes/PersonalInfo';
import { HeroSectionData } from '@ctypes/index';

import "@style/heroSection.css";

const HeroSection = ({ 
    data,
    commonData
}: { 
    data: PersonalData | null,
    commonData: HeroSectionData | null
}) => {

    return (
        <Section home={true} id='home' className='hero'>
            <div className="hero-content">
                <div className="hero-text fade-in">
                    <h1>{data?.name} {data?.surname}</h1>
                    <p className="subtitle">{data?.title}</p>
                    <p className="bio">{data?.bio}</p>
                    
                    <div className="cta-buttons">
                        <a href="#projects" className="btn btn-primary">
                            {commonData?.primaryBtn}
                        </a>
                        <a href="#contact" className="btn btn-secondary">
                            {commonData?.secondaryBtn}
                        </a>
                    </div>
                </div>
                
                <div className="hero-visual fade-in">
                    <div className="profile-card">
                        {/* <div className="profile-image">
                            {data?.avatar ? (
                                // <img src={data.avatar} alt={`${data.name} ${data.surname}`} />
                                null
                            ) : (
                                `${data?.name?.[0]}${data?.surname?.[0]}`
                            )}
                        </div> */}
                        <div className='color-white desc-on-image'>
                            <h3>{data?.name} {data?.surname}</h3>
                            <p>{data?.title}</p>
                            <p style={{ fontStyle: 'italic', fontSize: '14px' }}>{data?.contact?.location}</p>
                        </div>
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