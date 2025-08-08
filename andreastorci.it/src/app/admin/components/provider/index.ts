/**
 * `AuthProvider` gestisce l'autenticazione degli utenti e la gestione dei cookie di accesso al pannello di amministrazione.
 * 
 * @remarks
 * Utilizzare questo provider per avvolgere i componenti che necessitano di informazioni sull'autenticazione o di gestire lo stato di login/logout.
 *
 * `useAuth` è un hook che permette di accedere e gestire lo stato di autenticazione dell'utente.
 * 
 * @returns Oggetto contenente lo stato dell'utente autenticato e i metodi per aggiornare, aggiungere o eliminare i dati dell'utente.
 */
export { AuthProvider, useAuth } from "./AuthContext";

/**
 * `NotificationProvider` gestisce la visualizzazione delle notifiche generiche nell'applicazione.
 * 
 * @remarks
 * Utilizzare questo provider per abilitare la comparsa di notifiche nei componenti figli.
 *
 * `useNotification` è un hook che consente di mostrare notifiche personalizzate all'interno dell'applicazione.
 * 
 * @returns Funzioni per mostrare, nascondere o gestire notifiche.
 */
export { NotificationProvider, useNotification } from './NotificationsContext';

/**
 * `PageSelectorProvider` gestisce lo stato relativo alla selezione e visualizzazione delle pagine nell'applicazione.
 * 
 * @remarks
 * Utilizzare questo provider per controllare la navigazione tra le diverse pagine del pannello.
 *
 * `usePageSelector` è un hook che permette di accedere e modificare lo stato della pagina attualmente selezionata.
 * 
 * @returns Stato e funzioni per cambiare la pagina visualizzata.
 */
export { PageSelectorProvider, usePageSelector } from './PageSelectorContext';

/**
 * `ProjectProvider` gestisce la visualizzazione e lo stato dei progetti, sia in formato lista che in anteprima.
 * 
 * @remarks
 * Utilizzare questo provider per fornire ai componenti figli l'accesso ai dati e alle azioni sui progetti.
 *
 * `useProjectContext` è un hook che consente di accedere e gestire lo stato dei progetti.
 * 
 * @returns Stato dei progetti e funzioni per modificarli o visualizzarli.
 */
export { ProjectProvider, useProjectContext } from './ProjectContext';

/**
 * `MenuPageSelectorProvider` gestisce la selezione e visualizzazione delle pagine del menu laterale o di navigazione.
 * 
 * @remarks
 * Utilizzare questo provider per controllare la navigazione tra le pagine del menu.
 *
 * `useMenuPageSelector` è un hook che permette di accedere e modificare lo stato della pagina selezionata nel menu.
 * 
 * @returns Stato e funzioni per cambiare la pagina selezionata nel menu.
 */
export { MenuPageSelectorProvider, useMenuPageSelector } from './MenuPageSelectorContext';