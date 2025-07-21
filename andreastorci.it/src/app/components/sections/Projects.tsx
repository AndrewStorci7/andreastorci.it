/**
 * Project Section Component
 * @author Andrea Storci aka dreean
 */
'use client'

import React from 'react'
import Section from '@components/inc/Section';
import { PersonalData } from '@/types/PersonalInfo';

const ProjectsSection = ({ data }: { data: PersonalData | null }) => {

    const renderContent = (data: PersonalData | null) => {
        if (!data || data.projects.data.length === 0) {
            return <p>Nessun progetto disponibile.</p>;
        }

        return data.projects.data.map((project: any, index: number) => (
            <div key={index} className="project-card fade-in">
                <div className="project-image">
                    {project.image && <img src={project.image} alt={project.name} />}
                </div>
                <div className='project-content'>
                    <h3>{project.name}</h3>
                    <p>{project.description}</p>
                    {Object.keys(project.technologies).length > 0 && (
                        <div className="project-tech">
                            {project.technologies.map((tech: string, index: number) => (
                                <span key={index} className="tech-tag">{tech}</span>
                            ))}
                        </div>
                    )}
                    {project.link && <a href={project.link} target="_blank" rel="noopener noreferrer">Visualizza Progetto</a>}
                </div>
            </div>
        ));
    }
    
    return (
        <Section id='projects' className='projects-section' title={data?.projects.title}>
            <div className="projects-grid">
                {renderContent(data)}
            </div>
        </Section>
    )
}

export default ProjectsSection;