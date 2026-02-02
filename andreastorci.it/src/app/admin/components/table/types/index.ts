/**
 * Configurazione di una singola "voce" (colonna) della tabella.
 *
 * Definisce come deve essere rappresentata e comportarsi una colonna sia nell'intestazione
 * che nelle righe della tabella, incluse larghezza, allineamento e testi informativi
 * utilizzati nella fase di inserimento/modifica dei dati.
 *
 * @remarks
 * Utilizzata dalla componente di visualizzazione della tabella e dalla componente
 * di aggiunta/modifica (<TableAddNewItem>) per interpretare e rendere correttamente
 * ogni colonna.
 *
 * @property name - Nome visualizzato della voce/colonna.
 * @property width - Larghezza della colonna espressa in percentuale (numero). Se omesso si usa la larghezza di default.
 * @property bold - Se true rende il testo della colonna in grassetto.
 * @property centered - Se true centra orizzontalmente il contenuto della colonna.
 * @property marginAutoLeft - Se true applica margin-left: auto (utile per posizionamenti a destra).
 * @property marginAutoRight - Se true applica margin-right: auto (utile per posizionamenti a sinistra).
 * @property contentIsArray - Se true indica che il contenuto della cella è un array e richiede parsing specifico nella UI.
 * @property infoHeader - Testo informativo mostrato nell'intestazione della colonna (descrizione/aiuto).
 * @property infoContent - Testo informativo mostrato accanto all'input durante l'inserimento per quella colonna.
 * @property show - Controlla la visibilità del contenuto della voce nelle righe sottostanti; se false la colonna può essere nascosta.
 */
export interface VoicesProps {
    name: string            // nome della voce da visualizzare nel `<TableHeader>`
    width?: number          // numero per percentuale
    bold?: boolean
    centered?: boolean
    marginAutoLeft?: boolean
    marginAutoRight?: boolean,
    typeContent?: TypesContent
    contentIsArray?: boolean // serve per il parsing dei dati nella componente `<TableAddNewItem>`
    infoHeader?: string     // messaggio di info chge verra' visualizzato nell'header, 
                            // serve per informazioni addizionali al valore da inserire
    infoContent?: string    // messaggio di info che verra' visualizzato affianco all'input
                            // nella fase di inserimento per un determinato campo/colonna
    show?: boolean          // questa prop serve per mostrare/nascondere il contenuto di quella voce per le righe sottostanti
}

export interface DataInterface {
    dataKeys: string[]
    dataValues: unknown[]
}

export const TYPES_CONTENT = ["text", "long_text", "image"] as const;
export type TypesContent = typeof TYPES_CONTENT[number];

// export interface TableAddNewItemProps {
//     show?: boolean,
//     data?: DataInterface
//     handleSave?: (...args: any[]) => any,
//     handleCancel?: (...args: any[]) => any,
//     settings: VoicesProps[]
// }

/**
 * Costante della lunghezza delle due colonne finali
 * sia nell'intestazione che del contenuto
 */
// export const WIDTH_END = "50px"; // in pixel

// export const DEFAULT_WIDTH_TABLE = 10; // in percentuale