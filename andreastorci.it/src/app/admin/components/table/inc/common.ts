import { styles } from "../style/style";
import { VoicesProps } from "../types";

export const setStyleCol = (settings: VoicesProps, useFor: string) => {

    switch (settings.width) {
        default:
        case 2: {
            return useFor == "header" ? styles.headerCol2 : styles.rowCol2;
        }
        case 3: {
            return useFor == "header" ? styles.headerCol3 : styles.rowCol3;
        }
        case 4: {
            return useFor == "header" ? styles.headerCol4 : styles.rowCol4;
        }
        case 5: {
            return useFor == "header" ? styles.headerCol5 : styles.rowCol5;
        }
        case 1: {
            return useFor == "header" ? styles.headerCol1 : styles.rowCol1;
        }
    }
}