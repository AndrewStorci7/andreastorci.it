/**
 * Skills Section Component
 * @author Andrea Storci aka dreean
 */
'use client'

import React from 'react';
import Section from '@inc/Section';
import { Skill, SkillsSectionData } from '@ctypes/index';

const SkillsSection = ({ 
    data, 
    commonData 
}: { 
    data: Skill[] | null,
    commonData: SkillsSectionData | null 
}) => {

    const renderContent = (data: Skill[] | null) => {
        if (!data || data.length === 0) {
            return <p>Nessuna competenza disponibile.</p>;
        }

        return data.map((skill, index) => (
            <div key={index} className="skill-card fade-in">
                <h3>{skill.name}</h3>
                <div className='skill-tags'>
                    <span className="skill-tag skill-level">{skill.level}</span>
                    <span className="skill-tag skill-category">{skill.category}</span>
                </div>
            </div>
        ));
    }

    return (
        <Section id='skills' className='skills-section' title={commonData?.title}>
            <div className="skills-grid">
                {renderContent(data)}
            </div>
        </Section>
    );
}

export default SkillsSection;