interface CommonInfo {
    title: string;
    description: string;
}

export interface MenuItemsName {
    home: string;
    skills: string;
    projects: string;
    contact: string;
}

export interface HeroSectionData {
    primaryBtn: string;
    secondaryBtn: string;
}

export interface Experience {
    jobTitle: string;
    company: string;
    period: string;
    description: string;
    technologies?: string[];
}

export interface Education {
    degree: string;
    institution: string;
    year: string;
    description?: string;
}

//#region Skills Section
export interface SkillsSectionData extends CommonInfo {}

export interface Skill {
    // data: SkillsSectionData;
    name: string;
    level: number; // 1-5 o 1-10
    category: 'frontend' | 'backend' | 'design' | 'tools' | 'soft';
}

//#endregion Skills Section

//#region Projects Section
export interface ProjectsSectionData extends CommonInfo {
    button: string;
}

export interface Project {
    // data: ProjectsSectionData;
    name: string;
    type: string;
    role: string[];
    description: string;
    technologies: string[];
    link?: string;
    image?: string;
    sku?: string;
}

//#endregion Projects Section

//#region Contact Section
export interface ContactSectionData extends CommonInfo {
    button: string;
}

export interface ContactInfo {
    // data: ContactSectionData;
    email: string;
    phone?: string;
    location: string;
    linkedin?: string;
    github?: string;
    website?: string;
    announcements?: string;
}

//#endregion Contact Section

export interface LanguageData<Type> {
    [key: string]: Type;
}

export interface FuckWordpress extends CommonInfo {}