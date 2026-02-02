/**
 * Invia un file al server e restituisce il nome file restituito dall'API.
 *
 * Effettua una richiesta POST a "/api/files/upload" usando FormData con il campo "file".
 * Se il parametro `file` è `null`, la funzione risolve immediatamente con `null`.
 *
 * @param file - Il File da caricare. Se `null`, la funzione restituisce `null` senza effettuare richieste.
 * @param handleError - Funzione di callback chiamata in caso di errore. Viene invocata con un oggetto di notifica
 *                      ({ title, message, type, purpose }) per mostrare all'utente l'errore avvenuto.
 *
 * @returns Una Promise che risolve in:
 *          - il nome del file (string) così come fornito nel JSON di risposta dal server (proprietà `fileName`),
 *          - oppure `null` se non è stato passato alcun file, se si è verificato un errore durante il caricamento,
 *            o se la risposta del server non contiene il campo atteso.
 *
 * @remarks
 * - La funzione effettua il parsing del JSON di risposta e assegna `json.fileName` al valore restituito,
 *   senza verificare esplicitamente `res.ok`. È responsabilità del server restituire una risposta JSON valida con
 *   la proprietà `fileName`.
 * - In caso di errore di rete o eccezione, viene chiamato `handleError` con un oggetto di notifica e la funzione
 *   risolve con `null`.
 * - Effettua log della risposta JSON e degli errori sulla console (console.log).
 *
 * @example
 * const filename = await handleUpload(selectedFile, (err) => showNotification(err));
 */
export const handleUpload = async (
    file: File | null, 
    // setUpload: (val: string | null) => void,
    handleError: (...args: any | any[]) => void
): Promise<string | null> => {

    if (!file) return null;

    const formData = new FormData();
    formData.append('file', file);
    let filename: string | null = null;

    try {
        const res = await fetch('/api/files/upload', {
            method: 'POST',
            body: formData,
        });

        const json = await res.json();
        console.log(json)
        filename = json.fileName;

        // if (res.ok) {
        //     showNotification({
        //         title: "Successo",
        //         message: "File caricato correttamente",
        //         type: "completed"

        //     });
        // }
    } catch (error) {
        console.log(error)
        handleError({
            title: "Errore",
            message: <span>Errore nel caricamento del file</span>,
            type: "error",
            purpose: "notification"
        });
        // return null;
    } finally {
        return filename;
    }
};



/**
 * Rimuove un file lato server inviando una richiesta POST a '/api/files/remove'.
 *
 * Se `filename` è falsy la funzione ritorna immediatamente senza effettuare richieste.
 * In caso di errore la funzione:
 * - esegue il log dell'errore su console
 * - invoca `handleError` con un oggetto notifica:
 *   { title: "Errore", message: <span>Errore nell'eliminazione del file</span>, type: "error", purpose: "notification" }
 *
 * Effettua la richiesta con header 'Content-Type: application/json' e body JSON contenente `{ filename }`.
 *
 * @param filename - Nome (o percorso) del file da rimuovere. Se vuoto la funzione termina immediatamente.
 * @param handleError - Callback per la gestione degli errori. Viene chiamata con un payload di notifica; firma attesa: `(payload: any) => void`.
 * @returns Promise<void> - Risolve quando la richiesta HTTP termina. La funzione non rilancia eccezioni: eventuali errori sono gestiti internamente tramite `handleError`.
 * @example
 * await removeUpload('uploads/avatar.png', (err) => showNotification(err));
 * @see /api/files/remove
 */
export const removeUpload = async (
    filename: string | null, 
    handleError: (...args: any | any[]) => void
) => {
    if (!filename) return;

    try {
        const remove = await fetch('/api/files/remove', {
            method: 'POST',
            body: JSON.stringify({ filename }),
            headers: { 'Content-Type': 'application/json' }
        });

        if (!remove.ok) throw new Error('Failed to remove file');

    } catch (error) {
        console.log(error)
        handleError({
            title: "Errore",
            message: <span>Errore nell'eliminazione del file</span>,
            type: "error",
            purpose: "notification"
        });
        // return null;
    }
}