import React, { createContext, useContext, useEffect, useState } from 'react'
import { DataInterface, VoicesProps } from '../types'
import PersonalInfo from '@ctypes/PersonalInfo'

interface TableContextType extends TableProviderInterface {
    showAdd: boolean,           // visibilità della row di aggiunta
    setShowAdd: () => void      // switcha la visibilità della row di aggiunta 
    data: DataInterface         // oggetto con i dati nuovi del formato chaivi[], valori[]
    setData: (key: string, val: string | number) => void
}

interface TableProviderInterface {
    // apiEndpoint: string     // uri dell'endopint per aggiunta
    handleSave: (e: Object) => void     // funzione gancio da eseguire in caso di salvataggio
    handleCancel: Function  // funzione gancio da eseguire in caso di annullamento
    data: DataInterface     // oggetto con i dati nuovi del formato chaivi[], valori[]
    settings: VoicesProps[] // impostazioni di visualizzazione dei vari campi
    // children: React.ReactNode
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
    children
}: Extra) => {

    const PersonalData = new PersonalInfo("it-IT");
    // const [settings, setSettings] = 
    const [showAdd, setShowAdd] = useState<boolean>(false);
    const [newData, setNewData] = useState<DataInterface>({
        dataKeys: data.dataKeys,
        dataValues: data?.dataValues.length == 0 ? 
                    data.dataKeys.map(() => "") :
                    data.dataValues
    });

    useEffect(() => {
        if (settings.length == 0)
            throw new Error("La props `voices` deve almeno contenere un elemento, non può essere vuota");
        // if (contents.length == 0)
        //     throw new Error("La props `contents` deve almeno contenere un elemento, non può essere vuota");
        // if (voices.length !== contents.length)
        //     throw new Error(`Il numero degli elementi di \`voices\` e di \`contents\` non conicidono: numero degli elementi di \`voices\` -> ${voices.length}, numero degli elementi di \`contents\` -> ${contents.length}`)
    }, [settings])

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
    }

    // useEffect(() => {
        
    // }, [])

    return (
        <TableContext.Provider 
        value={{ 
            setShowAdd: handleSetShowAdd, 
            showAdd, 
            data: newData, 
            setData: handleSetData,
            // apiEndpoint,
            settings,
            handleCancel,
            handleSave: _handleSave
        }}>
            {children}
        </TableContext.Provider>
    )
}
