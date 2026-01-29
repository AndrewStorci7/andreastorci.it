import React, { useEffect } from 'react'
import { styles } from './style/style'
import { setStyleCol } from './inc/common';
import { Check, X } from 'lucide-react';
import { useTable } from './provider/TableContext';

export default function TableAddNewItem() {

    const { 
        settings, 
        data, 
        setData, 
        handleSave, 
        showAdd, 
        setShowAdd 
    } = useTable();

    const handleCancel = () => {
        setShowAdd()
    }

    const handleChange = (key: string, value: string | number) => {
        setData(key, value)
    }

    const renderInputs = () => {
        return settings.map((e, i) => {
            const rowCol = setStyleCol(e, "row");

            return (
                <div key={i} style={rowCol}>
                    <div style={(i == 0) ? styles.cellWithIndicator : {}}>
                        <div style={(i == 0) ? styles.indicatorNew : {}} />
                        <input
                            type="text"
                            placeholder={`Inserisci ${e.name} ...`}
                            value={data?.dataValues[i] as string}
                            onChange={(e) => handleChange(data?.dataKeys[i], e.target.value)}
                            style={styles.input}
                        />
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
                    <div style={styles.rowCol2}>
                        <button 
                        onClick={() => {
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
