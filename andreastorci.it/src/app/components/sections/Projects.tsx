/**
 * Project Section Component
 * @author Andrea Storci aka dreean
 */
'use client'

import React from 'react'
import Section from '@inc/Section';
// import { PersonalData } from '@ctypes/PersonalInfo';
import { Project, ProjectsSectionData } from '@ctypes/index';
import Techtag from '@inc/TechTag';

import "@style/projectsSectionStyle.css"

const ProjectsSection = ({
    preview = false,
    data,
    commonData
}: { 
    preview?: boolean,
    data: Project[] | null,
    commonData: ProjectsSectionData | null 
}) => {

    const renderContent = (data: Project[] | null) => {
        if (!data || data?.length === 0) {
            return <p>Nessun progetto disponibile.</p>;
        }

        return data.map((project: Project, index: number) => (
            <div key={index} className="project-card fade-in">
                <div className={`project-image ${project.sku}`}>
                    {project.image && <img width={400} src={project.image} alt={project.name} />}
                </div>
                <div className='project-content'>
                    <div className='flex'>
                        <h3>{project.name}</h3>
                        {/* <p className='project-type center'>- {project.type}</p> */}
                    </div>
                    <p>{project.description}</p>
                    {Object.keys(project.technologies).length > 0 && (
                        <div className="project-tech">
                            {project.technologies.map((tech: string, index: number) => (
                                <Techtag key={index} type={tech} />
                            ))}
                        </div>
                    )}
                    {project.link && <a href={project.link} target="_blank" rel="noopener noreferrer">{commonData?.button}</a>}
                </div>
            </div>
        ));
    }
    
    return (
        <Section id='projects' preview={preview} className='projects-section' title={commonData?.title}>
            <div className="projects-grid">
                {renderContent(data)}
            </div>
        </Section>
    )
}

export default ProjectsSection;