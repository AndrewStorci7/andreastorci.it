import type { 
    Project, 
    Education, 
    Skill,
    ContactInfo,
    Experience 
} from "@/types";

interface PersonalData {
    name: string;
    surname: string;
    title: string;
    bio: string;
    avatar?: string;
    contact: ContactInfo;
    experience: Experience;
    education: Education;
    projects: Project;
    skills: Skill;
    languages: {
        name: string;
        level: string;
    }[];
}

interface LanguageData {
    [key: string]: PersonalData;
}

class PersonalInfo {

    private data: LanguageData | null = null;
    private currentLang: string;
    private readonly supportedLangs = ["it-IT", "en-US", "en-GB", "es-ES"];
    private isLoaded = false;
    private loadingPromise: Promise<void> | null = null;

    constructor(lang: string) {
        this.validateLanguage(lang);
        this.currentLang = lang;
    }

    private validateLanguage(lang: string): void {
        if (!this.supportedLangs.includes(lang)) {
            throw new Error(`Lingua selezionata non corretta: deve essere una tra ${this.supportedLangs.join(', ')}`);
        }
    }

    private async loadPersonalData(): Promise<void> {
        if (this.isLoaded) return;
        
        if (this.loadingPromise) {
            return this.loadingPromise;
        }

        this.loadingPromise = this.fetchData();
        return this.loadingPromise;
    }

    private async fetchData(): Promise<void> {
        try {
            const response = await fetch('/data/personalData.json');
            
            if (!response.ok) {
                throw new Error(`Errore nel caricamento dei dati: ${response.status} ${response.statusText}`);
            }
            
            const data: LanguageData = await response.json();
            
            if (!data[this.currentLang]) {
                throw new Error(`Dati non disponibili per la lingua: ${this.currentLang}`);
            }
            
            this.data = data;
            this.isLoaded = true;
        } catch (error) {
            throw error;
        }
    }

    async getPersonalData(): Promise<PersonalData> {
        await this.loadPersonalData();
        
        if (!this.data || !this.data[this.currentLang]) {
            throw new Error('Dati non disponibili');
        }
        
        return this.data[this.currentLang];
    }

    async getContactInfo(): Promise<ContactInfo> {
        const data = await this.getPersonalData();
        return data.contact;
    }

    async getExperience(): Promise<Experience> {
        const data = await this.getPersonalData();
        return data.experience;
    }

    async getProjects(): Promise<Project> {
        const data = await this.getPersonalData();
        return data.projects;
    }

    async getSkills(): Promise<Skill> {
        const data = await this.getPersonalData();
        return data.skills;
    }

    // async getSkillsByCategory(category: Skill['data'][number]['category']): Promise<Skill[]> {
    //     const skills = await this.getSkills();
    //     return skills.filter(skill => skill['data'][0].category === category);
    // }

    async getEducation(): Promise<Education> {
        const data = await this.getPersonalData();
        return data.education;
    }

    async getFullName(): Promise<string> {
        const data = await this.getPersonalData();
        return `${data.name} ${data.surname}`;
    }

    async getBio(): Promise<string> {
        const data = await this.getPersonalData();
        return data.bio;
    }

    async changeLanguage(lang: string): Promise<void> {
        this.validateLanguage(lang);
        this.currentLang = lang;
        
        // Se i dati sono già caricati, verifica che la nuova lingua sia disponibile
        if (this.isLoaded && this.data && !this.data[lang]) {
            throw new Error(`Dati non disponibili per la lingua: ${lang}`);
        }
    }

    getCurrentLanguage(): string {
        return this.currentLang;
    }

    getSupportedLanguages(): string[] {
        return [...this.supportedLangs];
    }

    isDataLoaded(): boolean {
        return this.isLoaded;
    }

    async reload(): Promise<void> {
        this.data = null;
        this.isLoaded = false;
        this.loadingPromise = null;
        await this.loadPersonalData();
    }
}

export type { 
    PersonalData, 
    ContactInfo, 
    Experience, 
    Education, 
    Project, 
    Skill 
};

export default PersonalInfo;