/**
 * Contact Section Component
 * @author Andrea Storci aka dreean
 */
'use client'

import React from 'react';
import Section from '@components/inc/Section';
import { PersonalData } from '@/types/PersonalInfo';

import "@style/contactSectionStyle.css";

const ContactSection = ({ data }: { data: PersonalData | null }) => {

    return (
        <Section id='contact' className='contact-section' title={data?.contact.title}>
            <p className="fade-in announcement">{data?.contact.data.announcements}</p>
            <div className="contact-info fade-in">
                <div className="contact-item">
                    <div className="icon">📧</div>
                    <div>
                        <h4>Email</h4>
                        <p>{data?.contact.data.email}</p>
                    </div>
                </div>
                
                <div className="contact-item">
                    <div className="icon">📱</div>
                    <div>
                        <h4>Telefono</h4>
                        <p>{data?.contact.data.phone}</p>
                    </div>
                </div>
                
                <div className="contact-item">
                    <div className="icon">📍</div>
                    <div>
                        <h4>Posizione</h4>
                        <p>{data?.contact.data.location}</p>
                    </div>
                </div>
            </div>
            
            <div className="social-links fade-in">
                <a href="https://github.com/AndrewStorci7" className="social-link">
                    <img src="/social/github.png" alt="GitHub" />
                </a>
                <a href="https://linkedin.com/in/andreastorci" className="social-link">
                    <img src="/social/linkedin.png" alt="LinkedIn" />
                </a>
                <a href="https://twitter.com/dreean_dev" className="social-link">
                    <img src="/social/twitter.png" alt="Twitter" />
                </a>
                <a href="https://reddit.com/u/AndrewDrink7" className="social-link">
                    <img src="/social/reddit.png" alt="Reddit" />
                </a>
                <a href="https://instagram.com/andreastorci_" className="social-link">
                    <img src="/social/instagram.png" alt="Instagram" />
                </a>
            </div>
            
            <div className="fade-in" style={{ marginTop: '3rem' }}>
                <a href="mailto:astorci.andrea@gmail.com" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1.2rem 2.5rem' }}>
                    Iniziamo a Collaborare
                </a>
            </div>
        </Section>
    )
}

export default ContactSection;