export interface ContactInfo {
    title: string;
    data: {
        email: string;
        phone?: string;
        location: string;
        linkedin?: string;
        github?: string;
        website?: string;
        announcements?: string;
    }[]
}

export interface Experience {
    title: string;
    data: {
        jobTitle: string;
        company: string;
        period: string;
        description: string;
        technologies?: string[];
    }[]
}

export interface Education {
    title: string;
    data: {
        degree: string;
        institution: string;
        year: string;
        description?: string;
    }[]
}

export interface Skill {
    title: string;
    data: {
        name: string;
        level: number; // 1-5 o 1-10
        category: 'frontend' | 'backend' | 'design' | 'tools' | 'soft';
    }[]
}


export interface Skill {
    title: string;
    data: {
        name: string;
        level: number; // 1-5 o 1-10
        category: 'frontend' | 'backend' | 'design' | 'tools' | 'soft';
    }[]
}

export interface Project {
    title: string;
    data: {
        name: string;
        description: string;
        technologies: string[];
        link?: string;
        image?: string;
    }[];
}