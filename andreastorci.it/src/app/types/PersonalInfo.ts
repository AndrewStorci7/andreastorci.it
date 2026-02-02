import { 
    type Project, 
    type Education, 
    type Skill,
    type ContactInfo,
    type Experience,
    type PersonalData,
    type ResponseFromAPI,
    type DeleteRouteProp,
    type PossibleContent,
    LANGUAGES_TYPES,
    Attributes
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
        try {
            return await this.add('skills', newData);
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    async addOneProject(newData: Project): Promise<ResponseFromAPI> {
        try {
            return await this.add('projects', newData);
        } catch (err) {
            console.error(err);
            throw err;
        }
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

    async add(attribute: Attributes, newData: PossibleContent): Promise<ResponseFromAPI> {
        try {
            const route = await this.getRoute(attribute);

            LANGUAGES_TYPES.forEach(async element => {
                if (element !== this.currentLang) {
                    try {
                        newData = await this.translate(element, newData);
                        if (!newData) {
                            throw `Errore durante la traduzione nella lingua: "${element}"`
                        }
                    } catch (error) {
                        console.error(error);
                        throw error;
                    }
                }
    
                const bodyToSend = typeof newData === 'object' && newData !== null
                    ? { ...newData, lang: element }
                    : { data: newData, lang: element };

                const update = await fetch(route, {
                    method: 'POST',
                    headers: this.headers,
                    body: JSON.stringify(bodyToSend)
                }); 
        
                const resp = await update.json();
    
                if (!resp.success)
                    throw `Errore durante l'aggiunta del progetto nella lingua: "${element}"`
            });
    
            return { success: true } as ResponseFromAPI;

        } catch (error) {
            console.error(error);
            throw error;
        }
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

    async translate(lang: string, data: PossibleContent): Promise<PossibleContent | string> {
        try {
            const resp = await fetch("/api/translate", {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify({ lang, data })
            });
    
            const result: ResponseFromAPI = await resp.json();
            if (result.error) {
                return result.error;
            } else {
                if (result.translation === undefined)
                    throw "La traduzione e' null"

                return result.translation;
            }
        } catch (err) {
            console.error(err);
            throw err
        }
    }

    async reload(): Promise<void> {
        this.data = null;
        this.isLoaded = false;
        this.loadingPromise = null;
        await this.loadPersonalData();
    }

    private async getRoute(attribute: Attributes): Promise<string> {
        switch (attribute) {
            case 'projects':
                return '/api/data/addProject';
            case 'contact':
                return '/api/data/addContact';
            case 'education':
                return '/api/data/addEducation';
            case 'experience':
                return '/api/data/addExperience';
            case 'skills':
                return '/api/data/addSkill';
            case 'languages':
                return '/api/data/addLanguage';
            default:
                throw new Error(`Unknown attribute: ${attribute}`);
        }
    }
}

export type { PersonalData };

export default PersonalInfo;