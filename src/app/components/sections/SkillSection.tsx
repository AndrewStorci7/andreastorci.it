/**
 * Skills Section Component
 * @author Andrea Storci aka dreean
 */
'use client'

import { LevelSelector } from '@/admin/components/edit/skill/LevelSelector';
import { BadgeQuestionMark } from "lucide-react";
import { Skill, GeneralData } from '@ctypes';
import "@style/skillsSectionStyle.css";
import Section from '@inc/Section';
import React from 'react';

const SkillsSection = ({ 
    data, 
    commonData 
}: { 
    data: Skill[] | null,
    commonData: GeneralData | null 
}) => {

    const renderContent = (data: Skill[] | null) => {
        if (!data || data.length === 0) {
            return <p>Nessuna competenza disponibile.</p>;
        }

        return data.map((skill: Skill, index: number) => (
            <div key={index} className="skill-card fade-in relative">
                <h3>{skill.name}</h3>
                <div className='skill-tags flex center'>
                    {skill.new && <span data-tooltip="Nuova competenza" className="skill-tag skill-new flex center gap-3">
                        New
                        <BadgeQuestionMark size={20} /> 
                    </span>}
                    <LevelSelector 
                    currentLevel={skill.level as number} 
                    />
                    <span className="skill-tag skill-category">{skill.category}</span>
                </div>
            </div>
        ));
    }

    return (
        <Section 
        id='skills' 
        className='skills-section' 
        title={commonData?.title} >
            <div className="skills-grid">
                {renderContent(data)}
            </div>
        </Section>
    );
}

export default SkillsSection;