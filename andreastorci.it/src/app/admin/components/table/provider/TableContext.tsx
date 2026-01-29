import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { LevelSelector } from '@components/edit/skill/LevelSelector'
import { DataInterface, VoicesProps } from '../types'
import PersonalInfo from '@ctypes/PersonalInfo'
import { Project, Salam, Skill } from '@ctypes'

interface TableContextType extends TableProviderInterface {
    showAdd: boolean,           // visibilità della row di aggiunta
    setShowAdd: () => void      // switcha la visibilità della row di aggiunta 
    data: DataInterface         // oggetto con i dati nuovi del formato chaivi[], valori[]
    setData: (key: string, val: string | number) => void
    indexToDelete: number       // indice dell'elemento da eliminare
    setIndexToDelete: (i: number) => void // setter dell'indice
    contents: any[] | any       // dati effettivi da visualizzare nella tabella
    reload: () => void          // ricarica i dati specifici della tabella con attributo impostata con `attribute`
}

interface TableProviderInterface {
    // apiEndpoint: string     // uri dell'endopint per aggiunta
    handleSave: (e: Object) => void     // funzione gancio da eseguire in caso di salvataggio
    handleCancel: Function  // funzione gancio da eseguire in caso di annullamento
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
    // apiEndpoint,
    handleSave,
    handleCancel,
    data,
    settings,
    attribute,
    children
}: Extra) => {

    const PersonalData = new PersonalInfo("it-IT"); 
    const [contents, setContents] = useState<Salam>({ f: [] });
    const [index, setIndex] = useState<number>(-1);
    const [showAdd, setShowAdd] = useState<boolean>(false);
    const [newData, setNewData] = useState<DataInterface>({
        dataKeys: data.dataKeys,
        dataValues: data?.dataValues.length == 0 ? 
                    data.dataKeys.map(() => "") :
                    data.dataValues
    });

    // const settingsMemo = useMemo(() => settings, []);

    useEffect(() => {
        if (settings.length == 0)
            throw new Error("La props `voices` deve almeno contenere un elemento, non può essere vuota");

        reload()
    }, [])

    useEffect(() => {}, [contents])

    const handleSetShowAdd = () => {
        setShowAdd(prev => !prev)
    }

    const handleSetData = (key: string, value: string | number) => {
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

    const _handleSave = () => {

        const finalDataParsed = Object.fromEntries(
            newData.dataKeys.map((key, i) => [key, newData.dataValues[i]])
        );

        handleSave?.(finalDataParsed)
        
        // dopo il salvataggio 
        reload();
    }

    const reload = async () => {
        console.log("Reloading...")
        PersonalData.reload();

        let content: Salam = { f: [] };
        switch (attribute) {
            case "projects": {
                // setContents(PersonalData.getProjects())
                content.f = await PersonalData.getProjects();
                content.f = content.f.map((project: Project) => Object.values(project).slice(0, 4))
                content.f.map((project, i) => {
                    const values = Object.values(project);
                    const firstThree = values.slice(0, 3);
                    const fourthElement = values[3]; 
                    return [...firstThree, fourthElement];
                });
                break;
            }
            case "skills": {
                content.f = await PersonalData.getSkills();
                content.f = content.f.map((skill: Skill) => Object.values(skill));
                content.f.map((e) => {
                    let backup = e;
                    // const tmp = backup[1];
                    // backup[1] = backup[2];
                    // backup[2] = tmp;
                    // backup[2] = <LevelSelector currentLevel={backup[2]} />
                    backup[1] = <LevelSelector currentLevel={backup[1]} />
                    return backup
                })
                break;
            }
            case "contact": {
                content.f = await PersonalData.getContactInfo();
                // TODO
                break;
            }
        }

        if (content.f && content.f.length > 0) {
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
            // settings: settingsMemo,
            settings,
            handleCancel,
            handleSave: _handleSave,
            contents: contents.f,
            reload
        }}>
            {children}
        </TableContext.Provider>
    )
}
