import type { 
    Project, 
    Education, 
    Skill,
    ContactInfo,
    Experience,
    LanguageData
} from "@ctypes/index";
import OOB from "@ctypes/OOB";

interface PersonalData {
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
}

// class PersonalInfo extends OOB<LanguageData<PersonalData>> {
class PersonalInfo extends OOB<PersonalData> {

    constructor(lang: string) {
        super(lang);
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
            const response = await fetch(`/data/${this.currentLang}.json`);
            
            if (!response.ok) {
                throw new Error(`Errore nel caricamento dei dati: ${response.status} ${response.statusText}`);
            }
            
            // const data: LanguageData<PersonalData> = await response.json();
            const data: PersonalData = await response.json();

            if (!data) {
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

        if (!this.data || !this.data) {
            throw new Error('Dati non disponibili');
        }

        return this.data;
    }

    async getContactInfo(): Promise<ContactInfo> {
        const data = await this.getPersonalData();
        return data.contact;
    }

    async getExperience(): Promise<Experience[]> {
        const data = await this.getPersonalData();
        return data.experience;
    }

    async getProjects(): Promise<Project[]> {
        const data = await this.getPersonalData();
        console.log(data.projects)
        return data.projects;
    }

    async getSkills(): Promise<Skill[]> {
        const data = await this.getPersonalData();
        return data.skills;
    }

    // async getSkillsByCategory(category: Skill['data'][number]['category']): Promise<Skill[]> {
    //     const skills = await this.getSkills();
    //     return skills.filter(skill => skill['data'][0].category === category);
    // }

    async getEducation(): Promise<Education[]> {
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

    async reload(): Promise<void> {
        this.data = null;
        this.isLoaded = false;
        this.loadingPromise = null;
        await this.loadPersonalData();
    }
}

export type { PersonalData };

export default PersonalInfo;