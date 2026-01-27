import {
    ProjectsSectionData,
    ContactSectionData,
    // LanguageData,
    MenuItemsName,
    HeroSectionData,
    GeneralData
} from '@ctypes';
// import OOB from "@ctypes/OOB";
// import { PersonalData } from './PersonalInfo';

interface CommonData {
    menu_section: MenuItemsName,
    hero_section: HeroSectionData,
    skills_section: GeneralData,
    projects_section: ProjectsSectionData,
    contacts_section: ContactSectionData,
    fuckWordpress: GeneralData
} 

// class CommonInfo extends OOB<LanguageData<CommonData>> {

//     constructor(lang: string) {
//         super(lang);
//     }

//     private async loadCommonData(): Promise<void> {
//         if (this.isLoaded) return;

//         if (this.loadingPromise) {
//             return this.loadingPromise;
//         }

//         this.loadingPromise = this.fetchData();
//         return this.loadingPromise;
//     }

//     private async fetchData(): Promise<void> {
//         try {
//             const common = await fetch('/data/common.json');

//             if (!common.ok) {
//                 throw new Error(`Error fetching common data: ${common.status} ${common.statusText}`);
//             }

//             const commonData: LanguageData<CommonData> = await common.json();

//             if (!commonData[this.currentLang]) {
//                 throw new Error(`Dati non disponibili per la lingua: ${this.currentLang}`);
//             }

//             this.data = commonData;
//             this.isLoaded = true;
//         } catch (error) {
//             console.error('Error fetching common data:', error);
//         }
//     }

//     public async getData(): Promise<PersonalData | null> {
//         await this.loadCommonData();
//         // if (!this.data) return null;
//         return this.data![this.currentLang];
//     }

// }

export type { CommonData };

// export default CommonInfo;