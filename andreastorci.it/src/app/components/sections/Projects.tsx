/**
 * Project Section Component
 * @author Andrea Storci aka dreean
 */
'use client'
import { Project, ProjectsSectionData } from '@ctypes';
// import { PersonalData } from '@ctypes/PersonalInfo';
import "@style/projectsSectionStyle.css";
import "@style/techTagStyle.css";
import Section from '@inc/Section';
import Techtag from '@inc/TechTag';
import Image from 'next/image';
import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const uploadDir = process.env.NEXT_PUBLIC_IMAGE_PREFIX;

const ProjectsSection = ({
    preview = false,
    data,
    commonData
}: { 
    preview?: boolean,
    data: Project[] | null,
    commonData: ProjectsSectionData | null 
}) => {

    const renderTechTags = (technologies: string[]) => {
        // <Techtag key={index} type={tech} />
        
        return (<div className='project-tech'>
            {technologies.map((tech, index) => (
                <Techtag key={index} type={tech} />
            ))}
        </div>)
    }

    const renderContent = (data: Project[] | null) => {
        if (!data || data?.length === 0) {
            return <p>Nessun progetto disponibile.</p>;
        }

        return data.map((project: Project, i: number) => (
            <div key={i} className='single-project-section fade-in' >
                <div className={`project-content ${i % 2 === 0 ? 'row' : 'row-reverse'}`}>
                    <div className='project-image-container'>
                        <Image
                            src={`${uploadDir}/${project.image}`}
                            alt={project.name}
                            width={500}
                            height={200}
                            // layout='fill'
                            // objectFit='cover'
                            className='project-image'
                        />
                        <div className="project-image-overlay"></div>
                    </div>
                    <div className='project-details'>
                        <div>
                            <h3 className='project-title'>{project.name}</h3>
                        </div>
                        <div>
                            <p className='justify'>{project.description}</p>
                        </div>
                        {renderTechTags(project.technologies)}
                        <a href={project.link} target="_blank" className='project-link'>
                            {commonData?.button}
                            <ArrowUpRight />
                        </a>
                    </div>
                </div>
            </div>
        ));
    }
    
    return (
        <Section 
        id='projects' 
        preview={preview} 
        className='projects-section' 
        title={commonData?.title} >
            <div onMouseMove={(e) => console.log(e.clientX, e.clientY)} >
                {renderContent(data)}
            </div>
        </Section>
    )
}

export default ProjectsSection;