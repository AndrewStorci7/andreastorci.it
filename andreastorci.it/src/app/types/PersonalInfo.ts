import type { 
    Project, 
    Education, 
    Skill,
    ContactInfo,
    Experience,
    PersonalData,
    ResponseFromAPI,
    DeleteRouteProp
} from "@ctypes";
import OOB from "@ctypes/OOB";
import { CommonData } from "@ctypes/CommonInfo";

// class PersonalInfo extends OOB<LanguageData<PersonalData>> {
class PersonalInfo extends OOB<PersonalData> {

    protected headers;

    constructor(lang: string) {
        super(lang);
        this.headers = { 'Content-Type': 'application/json' }
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
            const response = await fetch("/api/data", {
                method: "POST",
                headers: this.headers,
                body: JSON.stringify({ language: this.currentLang })
            });

            if (!response.ok) {
                throw new Error(`Errore nel caricamento dei dati: ${response.status} ${response.statusText}`);
            }
            
            const data: ResponseFromAPI = await response.json();

            if (!data.success) {
                throw new Error(`Dati non disponibili per la lingua: ${this.currentLang} - ${data.message || data.error}`);
            }
            
            this.data = data.data as PersonalData;
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
        return data.projects;
    }

    async getSkills(): Promise<Skill[]> {
        const data = await this.getPersonalData();
        return data.skills;
    }

    async addOneSkill(newData: Skill): Promise<ResponseFromAPI> {
        const update = await fetch("/api/data/addSkill", {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(newData)
        }); 

        const resp = await update.json();

        return resp
    }

    async addOneProject(newData: Project): Promise<ResponseFromAPI> {
        const update = await fetch("/api/data/addProject", {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(newData)
        }); 

        const resp = await update.json();

        return resp
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

    async getCommonInfos(): Promise<CommonData> {
        const data = await this.getPersonalData();
        const commonData: CommonData = {
            menu_section: data.menu_section,
            hero_section: data.hero_section,
            skills_section: data.skills_section,
            projects_section: data.projects_section,
            contacts_section: data.contacts_section,
            fuckWordpress: data.fuckWordpress
        }

        return commonData;
    }

    async delete({ attribute, index }: DeleteRouteProp): Promise<ResponseFromAPI> {
        
        const resp = await fetch("/api/delete", {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify({ attribute, index })
        });

        const json = await resp.json();
        
        return json;
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