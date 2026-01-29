import { ReactNode, MouseEventHandler } from "react";

export interface User {
    id: string,
    name: string,
    username: string
}

export interface PersonalData {
    name: string;
    surname: string;
    title: string;
    bio: string;
    avatar?: string;
    contact: ContactInfo;
    experience: Experience[];
    education: Education[];
    projects: Project[];
    skills: Skill[];
    languages: {
        name: string;
        level: string;
    }[];

    /// Dati delle sezioni
    menu_section: MenuItemsName,
    hero_section: HeroSectionData,
    skills_section: GeneralData,
    projects_section: ProjectsSectionData,
    contacts_section: ContactSectionData,
    fuckWordpress: GeneralData
}

export interface ResponseFromAPI {
    success?: boolean,
    data?: any,
    message?: string,
    error?: string,
    user?: User
} 

// export interface ErrorFromAPI {
//     error?: string,
//     retryAfter?: number
// } 

export interface DeleteRouteProp {
    attribute: 'projects' | 'contact' | 'education' | 'experience' | 'skills' | 'languages',
    index: number,
    // lang: string,
}

export interface GeneralData {
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
export interface Skill {
    // data: SkillsSectionData;
    name: string;
    level: number | ReactNode; // 1-5 o 1-10
    category: string;
}

//#endregion Skills Section

//#region Projects Section
export interface ProjectsSectionData extends GeneralData {
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
export interface ContactSectionData extends GeneralData {
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

export const LOG_TYPES = ['visits', 'country'] as const
export const LOG_RANGES = ['month', 'week', 'year', 'alltime'] as const
export type Range = typeof LOG_RANGES[number];
export type Type = typeof LOG_TYPES[number];

export const NOTIFICATIONS_TYPES = ['error', 'info', 'completed', 'warning'] as const;
export type NotificationsTypes = typeof NOTIFICATIONS_TYPES[number];

export const NOTIFICATIONS_PURPOSES = ['alert', 'notification'] as const;
export type NotificationPurpose = typeof NOTIFICATIONS_PURPOSES[number];

export type NotificationType = {
    show?: boolean;
    purpose?: NotificationPurpose;
    type?: NotificationsTypes;
    title?: string;
    message?: string | ReactNode | null;
    customIcon?: ReactNode;
    duration?: number;
    buttons?: Button[]
}

export type Button = {
    // onClick: Function,
    onClick: MouseEventHandler<HTMLButtonElement>
    text: string
    type: string
}

export type MenuItem = {
    pageId: string
    onClick: (arg?: string) => void
    disabled?: boolean
}

export const LANGUAGES_TYPES = ['it-IT', 'es-ES', 'en-GB'] as const;
export type Languages = typeof LANGUAGES_TYPES[number];

export type PossibleContent = 
    | Project[]
    | ContactInfo
    | Experience[]
    | Skill[]
    | Education[]
    | null

export interface Salam {
    f: any[] | [] | any | null
}