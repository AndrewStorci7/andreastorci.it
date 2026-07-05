class OOB<Type> {

    protected data: Type | null = null;

    protected currentLang: string;
    protected readonly supportedLangs = ["it-IT", "en-GB", "es-ES"];
    protected isLoaded = false;
    protected loadingPromise: Promise<void> | null = null;

    constructor(lang: string) {
        this.validateLanguage(lang);
        this.currentLang = lang;
    }

    protected validateLanguage(lang: string): void {
        if (!this.supportedLangs.includes(lang)) {
            throw new Error(`Lingua selezionata non corretta: deve essere una tra ${this.supportedLangs.join(', ')}`);
        }
    }

    async changeLanguage(lang: string): Promise<void> {
        this.validateLanguage(lang);
        this.currentLang = lang;
        
        // Se i dati sono già caricati, verifica che la nuova lingua sia disponibile
        if (this.isLoaded && this.data) {
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
}

export default OOB;