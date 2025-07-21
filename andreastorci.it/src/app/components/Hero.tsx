'use client'
import React, { useEffect, useState } from 'react'
import Section from '@components/inc/Section';
import PersonalInfo, { PersonalData } from '@/classes/PersonalInfo';

const HeroSection = () => {

    const [pd, setPd] = useState<PersonalData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const personalInfo = new PersonalInfo('it');
            const data = await personalInfo.getPersonalData();
            console.log(data)
            setPd(data);
        } catch (err) {
            console.error('Errore nel caricamento dei dati:', err);
            setError(err instanceof Error ? err.message : 'Errore sconosciuto');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getData();
    }, []);

    // if (loading) {
    //     return (
    //         <Section home id='home' className='hero'>
    //             <div className="hero-content">
    //                 <div className="hero-text fade-in">
    //                     <h1>Caricamento...</h1>
    //                 </div>
    //             </div>
    //         </Section>
    //     );
    // }

    if (error) {
        return (
            <Section home id='home' className='hero'>
                <div className="hero-content">
                    <div className="hero-text fade-in">
                        <h1>Errore: {error}</h1>
                    </div>
                </div>
            </Section>
        );
    }

    return (
        <Section home={true} id='home' className='hero'>
            <div className="hero-content">
                <div className="hero-text fade-in">
                    <h1>{pd?.name} {pd?.surname}</h1>
                    <p className="subtitle">{pd?.title}</p>
                    <p className="bio">{pd?.bio}</p>
                    
                    <div className="cta-buttons">
                        <a href="#projects" className="btn btn-primary">Visualizza Progetti</a>
                        <a href="#contact" className="btn btn-secondary">Contattami</a>
                    </div>
                </div>
                
                <div className="hero-visual fade-in">
                    <div className="profile-card">
                        <div className="profile-image">
                            {pd?.avatar ? (
                                <img src={pd.avatar} alt={`${pd.name} ${pd.surname}`} />
                            ) : (
                                `${pd?.name?.[0]}${pd?.surname?.[0]}`
                            )}
                        </div>
                        <h3>{pd?.name} {pd?.surname}</h3>
                        <p>{pd?.title}</p>
                        <p>{pd?.contact?.location}</p>
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