import React, { useEffect, useState } from 'react'
import { VoicesProps } from './types';
import "./style/main.css"
import { styles } from './style/style';
import { Trash2, Edit2, Plus, Ellipsis } from 'lucide-react';
import TableAddNewItem from './TableAddNewItem';
import { setStyleCol } from './inc/common';
import { useTable } from './provider/TableContext';

interface TableContentProps {
    content: any[],
    // settings: VoicesProps[],
    // handlerForAdd: Function,
    // showAddRow: boolean
}

export default function TableContent({
    content,
    // settings,
    // handlerForAdd,
    // showAddRow
}: TableContentProps) {

    const { settings } = useTable();

    const [hoveredRow, setHoveredRow] = useState<number>(-1);

    const handleDelete = (id: number) => {
        //setData(data.filter(item => item.id !== id));
    };

    const renderContents = () => {
        if (!content || content.length == 0 || !Array.isArray(content)) {
            return (
                <div style={styles.emptyState}>
                    <div style={styles.emptyContent}>
                        <div style={styles.emptyIcon}>
                            <Plus size={32} />
                        </div>
                        <p style={styles.emptyTitle}>Nessun dato disponibile</p>
                        {/* <p style={styles.emptySubtitle}>Clicca su "Aggiungi" per iniziare</p> */}
                    </div>
                </div>
            )
        } else {

            return content.map((e, i) => {
                if (!Array.isArray(e))
                    throw new Error("L'elemento passato non è un array");
    
                return (
                    <div 
                    key={i} 
                    onMouseEnter={() => setHoveredRow(i)}
                    onMouseLeave={() => setHoveredRow(-1)}
                    style={{
                        ...styles.tableRow,
                        ...(hoveredRow === i ? styles.tableRowHovered : {}),
                        animation: `slideIn 0.3s ease ${i * 0.1}s backwards`
                    }}
                    >
                        {e.map((val: any, val_i: number) => {
                            // console.log(val_i, settings[val_i].width);
                            const setting = settings[val_i] ?? {};
                            const rowCol = setStyleCol(setting, "row");
                            
                            let textSliced = val;
                            let sliced = false;
                            if (Array.isArray(val)) {
                                textSliced = val.map((text, i) => (
                                    <span key={i}>{text}{i < val.length - 1 ? ", " : ""}</span>
                                ));
                            } else if (typeof val === "string") {
                                sliced = val.length > 100;
                                textSliced = val.length > 100 
                                    ? val.slice(0, 100) + "..."
                                    : val;
                            }

                            return (<div key={`${i}${val_i}`} style={rowCol}>
                                <div className='relative' style={(val_i == 0) ? styles.cellWithIndicator : {}}>
                                    {(val_i == 0) && (
                                        <div style={{
                                            ...styles.indicator,
                                            ...(hoveredRow === i ? styles.indicatorActive : {})
                                        }} />
                                    )}
                                    <span style={styles.cellTextBold}>{textSliced}</span>
                                    {sliced && (
                                        <button
                                        className='absolute see-more-button' 
                                        style={{
                                            ...styles.actionButton,
                                            ...styles.seeMoreButton,
                                            ...(hoveredRow === i ? styles.actionButtonVisible : styles.actionButtonHidden)
                                        }}>
                                            <Ellipsis size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>)
                        })}
    
                        <div style={styles.rowCol2}>
                            <button style={{
                                ...styles.actionButton,
                                ...styles.editButton,
                                ...(hoveredRow === i ? styles.actionButtonVisible : styles.actionButtonHidden)
                            }}>
                                <Edit2 size={18} />
                            </button>
                            <button
                                onClick={() => handleDelete(i)}
                                style={{
                                    ...styles.actionButton,
                                    ...styles.deleteButton,
                                    ...(hoveredRow === i ? styles.actionButtonVisible : styles.actionButtonHidden)
                                }}
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                )
            })
        }
    }

    return (
        <div style={styles.tableBody}>
            <TableAddNewItem 
            // show={showAddRow} 
            />
            {renderContents()}
        </div>
    )
}
