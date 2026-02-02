import { useTable } from './provider/TableContext';
import { setStyleCol } from './inc/common';
import React, { useEffect } from 'react';
import { Check, X } from 'lucide-react';
import { TypesContent } from './types';
import { styles } from './style/style';

export default function TableAddNewItem() {

    const { 
        settings, 
        data, 
        setData, 
        handleSave, 
        showAdd, 
        setShowAdd,
        upload,
        setUpload
    } = useTable();

    const handleCancel = () => {
        setShowAdd()
    }

    const handleChange = (key: string, value: string | File | number, isArray: boolean = false) => {
        console.log(value)
        if (isArray) {
            if (typeof value === "string") {
                const valueParsed: string[] = value.split(","); 
                setData(key, valueParsed)
                return;
            }
        }
        
        setData(key, value)
    }

    const renderInputs = () => {
        return settings.map((e, i) => {

            const rowCol = setStyleCol(e, "row");
            const showInfoContent = e.infoContent ? true : false;
            const isArray = e.contentIsArray;
            const typeContent: TypesContent = e.typeContent ?? "text";

            return (
                <div key={i} style={rowCol}>
                    <div style={(i == 0) ? styles.cellWithIndicator : {}}>
                        <div style={(i == 0) ? styles.indicatorNew : {}} />
                        <input
                            type={(typeContent === "image") ? "file" : "text"}
                            placeholder={`Inserisci ${e.name} ...`}
                            value={(typeContent === "image") ? "" : data?.dataValues[i] as string}
                            onChange={(e) => handleChange(
                                data?.dataKeys[i], 
                                (typeContent === "image" && e.target.files?.[0]) ? 
                                    e.target.files[0] : 
                                    e.target.value, 
                                isArray
                            )}
                            style={styles.input}
                        />
                        {/* 
                            TODO: inserire un elemento che all'hover faccia visualizzare
                            il messaggio di info 
                        */}
                        {/* {showInfoContent && (
                            <div style={styles.infoContent}>
                                {e.infoContent}
                            </div>
                        )} */}
                    </div>
                </div>
            )
        })
    }

    useEffect(() => {
        if (!data || data.dataKeys.length === 0)
            throw new Error("La prop `data` non può essere `null` o vuota")            
    }, [data])

    useEffect(() => {}, [data])

    return (
        <>
            {showAdd && (
                <div style={{ ...styles.tableRow, ...styles.addingRow }}>
                    {renderInputs()}
                    <div style={styles.rowCol1}>
                        <button 
                        onClick={() => {
                            setUpload?.("uploading");
                            handleSave({})
                            setShowAdd()
                        }} 
                        style={{ ...styles.actionButton, ...styles.saveButton }}
                        >
                            <Check size={18} />
                        </button>
                        <button onClick={handleCancel} style={{ ...styles.actionButton, ...styles.cancelButton }}>
                            <X size={18} />
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}
