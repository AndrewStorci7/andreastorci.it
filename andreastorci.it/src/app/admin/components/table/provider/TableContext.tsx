import React, { createContext, useContext, useEffect, useState } from 'react';
import { LevelSelector } from '@components/edit/skill/LevelSelector';
import { useNotification, usePageSelector } from '@providers';
import { PossibleContent, Project, Skill } from '@ctypes';
import { DataInterface, VoicesProps } from '../types';
import { handleUpload, removeUpload } from '@admin/inc/manageFiles';
import PersonalInfo from '@ctypes/PersonalInfo';

interface TableContextType extends TableProviderInterface {
    showAdd: boolean,           // visibilità della row di aggiunta
    setShowAdd: () => void      // switcha la visibilità della row di aggiunta 
    data: DataInterface         // oggetto con i dati nuovi del formato chaivi[], valori[]
    setData: (key: string, val: File | string | string[] | number) => void
    indexToDelete: number       // indice dell'elemento da eliminare
    setIndexToDelete: (i: number) => void // setter dell'indice
    contents: PossibleContent   // dati effettivi da visualizzare nella tabella
    reload: () => void          // ricarica i dati specifici della tabella con attributo impostata con `attribute`
    upload?: string | null       // indica se è in corso un upload
    setUpload?: (upload: string | null) => void // setter per l'upload
}

interface TableProviderInterface {
    // apiEndpoint: string     // uri dell'endopint per aggiunta
    handleSave: (e: object) => Promise<void>     // funzione gancio da eseguire in caso di salvataggio

    handleCancel: (...args: unknown[]) => unknown  // funzione gancio da eseguire in caso di annullamento
    data: DataInterface     // oggetto con i dati nuovi del formato chaivi[], valori[]
    settings: VoicesProps[] // impostazioni di visualizzazione dei vari campi
    // attributo della tabella gestita
    attribute: 'projects' | 'contact' | 'education' | 'experience' | 'skills' | 'languages',       
}

interface Extra extends TableProviderInterface {
    children: React.ReactNode
}

const TableContext = createContext<TableContextType | null>(null);

export const useTable = () => {
    const context = useContext(TableContext);
    if (!context) {
        throw new Error('useTable must be used within TableProvider');
    }
    return context;
}

export const TableProvider = ({
    handleSave,
    handleCancel,
    data,
    settings,
    attribute,
    children
}: Extra) => {

    // dati generali
    const PersonalData = new PersonalInfo("it-IT"); 
    const { showNotification } = useNotification();
    const { setLoader } = usePageSelector();

    const [contents, setContents] = useState<PossibleContent>(null);
    const [index, setIndex] = useState<number>(-1);
    const [showAdd, setShowAdd] = useState<boolean>(false);
    const [isUploading, setIsUploading] = useState<string | null>(null);
    const [newData, setNewData] = useState<DataInterface>({
        dataKeys: data.dataKeys,
        dataValues: data?.dataValues.length == 0 ? 
                    data.dataKeys.map(() => "") :
                    data.dataValues
    });

    useEffect(() => {
        if (settings.length == 0)
            throw new Error("La props `voices` deve almeno contenere un elemento, non può essere vuota");

        reload();
    }, [])

    useEffect(() => {}, [contents])

    const handleSetUpload = (val: string | null) => {
        setIsUploading(val);
    }

    const handleSetShowAdd = () => {
        setShowAdd(prev => !prev);
    }

    const handleSetData = (key: string, value: File | string | string[] | number) => {
        // aggiungere dopo validazione di `key` e `value`
        setNewData(prev => {
            const indexKey = prev.dataKeys.findIndex((k) => k === key);
            if (indexKey === -1) return prev;
            const updatedValues = prev.dataValues.map((v, i) => i === indexKey ? value : v);
        
            return { 
                ...prev,
                dataKeys: [...prev.dataKeys],
                dataValues: updatedValues  
            };
        });
    }

    const _handleSave = async () => {

        setLoader(true, "Caricando i file ...");
        let finalFileName = null;

        const fileIndex = newData.dataKeys.findIndex(key => key === 'image' || key === 'file');
        const fileObject = fileIndex !== -1 ? newData.dataValues[fileIndex] : null;

        if (fileObject instanceof File) {
            finalFileName = await handleUpload(
                fileObject,
                showNotification
            );

            if (!finalFileName) {
                setLoader(false);
                return; 
            }
        }

        setLoader(true, "Salvando i dati ...");
        const finalDataParsed = Object.fromEntries(
            newData.dataKeys.map((key, i) => {
                if ((key === 'image' || key === 'file') && finalFileName) {
                    return [key, finalFileName];
                }
                return [key, newData.dataValues[i]];
            })
        );

        try {
            setLoader(true, "Traduzione in corso ...");
            await handleSave?.(finalDataParsed);
            reload(); 
            setShowAdd(false);
        } catch (err) {
            console.error("Errore salvataggio DB:", err);
            await removeUpload(finalFileName, showNotification);
        } finally {
            setLoader(false);
        }
    }

    const reload = async () => {
        // ricaricando i dati
        PersonalData.reload();
        // resetto i dati dell'aggiunta
        setNewData({
            dataKeys: data.dataKeys,
            dataValues: data?.dataValues.length == 0 ?
                data.dataKeys.map(() => "") :
                data.dataValues
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let content: PossibleContent | any[] = null;
        switch (attribute) {
            case "projects": {
                content = await PersonalData.getProjects();
                content = content.map((project: Project) => Object.values(project))
                break;
            }
            case "skills": {
                content = await PersonalData.getSkills();
                content = content.map((skill: Skill) => Object.values(skill));
                if (Array.isArray(content)) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    content.map((e: any[]) => {
                        const backup = e;
                        backup[1] = <LevelSelector currentLevel={backup[1]} />
                        return backup
                    })
                }
                break;
            }
            case "contact": {
                content = await PersonalData.getContactInfo();
                // TODO
                break;
            }
        }

        if (content) {
            setContents(content)
        } else {
            throw new Error(`Errore durante il reload dei dati per ${attribute}`);
        }
    }

    return (
        <TableContext.Provider 
        value={{ 
            setShowAdd: handleSetShowAdd, 
            showAdd, 
            data: newData, 
            setData: handleSetData,
            attribute,
            indexToDelete: index,
            setIndexToDelete: setIndex,
            settings,
            handleCancel,
            handleSave: _handleSave,
            contents,
            reload,
            upload: isUploading,
            setUpload: handleSetUpload
        }}>
            {children}
        </TableContext.Provider>
    )
}
