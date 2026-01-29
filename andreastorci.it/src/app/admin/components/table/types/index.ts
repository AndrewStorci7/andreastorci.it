export interface VoicesProps {
    name: string    // nome della voce
    width?: number  // numero per percentuale
    bold?: boolean
    centered?: boolean
    marginAutoLeft?: boolean
    marginAutoRight?: boolean
}

export interface DataInterface {
    dataKeys: string[]
    dataValues: any[]
}

// export interface TableAddNewItemProps {
//     show?: boolean,
//     data?: DataInterface
//     handleSave?: Function,
//     handleCancel?: Function,
//     settings: VoicesProps[]
// }

/**
 * Costante della lunghezza delle due colonne finali
 * sia nell'intestazione che del contenuto
 */
export const WIDTH_END = "50px"; // in pixel

export const DEFAULT_WIDTH_TABLE = 10; // in percentaule