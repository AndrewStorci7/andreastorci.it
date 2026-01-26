import React, { useEffect, useState } from 'react'
import { DEFAULT_WIDTH_TABLE, VoicesProps, WIDTH_END } from './types';
import "./style/main.css"
import Icon from "@inc/Icon";
import { styles } from './style/style';
import { Trash2, Edit2, Plus } from 'lucide-react';

interface TableContentProps {
    content: any[],
    settings: VoicesProps[]
}

export default function TableContent({
    content,
    settings
}: TableContentProps) {

    // const [borderRadius, setBorderRadius] = useState<string>("10px 0 0 10px");
    // const [hovered, setHovered] = useState<boolean>(false);

    // const hover = (enter: boolean) => {
    //     if (enter) {
    //         setBorderRadius("10px");
    //         setHovered(true);
    //     } else {
    //         setBorderRadius("10px 0 0 10px");
    //         setHovered(false);
    //     }
    // }
    const [data, setData] = useState(null);
    const [hoveredRow, setHoveredRow] = useState<number>(-1);

    const handleDelete = (id: number) => {
        //setData(data.filter(item => item.id !== id));
    };

    const handleAdd = () => {
        // const newItem = {
        //     id: data.length + 1,
        //     voce1: "Nuova voce",
        //     voce2: `${data.length + 1}Voce`,
        //     voce3: `${data.length + 1}Dato`
        // };
        // // setData([...data, newItem]);
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
                            const rowCol = (setting.width == 5) ? styles.rowCol5 :
                                           (setting.width == 4) ? styles.rowCol4 :
                                           (setting.width == 3) ? styles.rowCol3 :
                                           (setting.width == 1) ? styles.rowCol1 :
                                           styles.rowCol2;
                            
                            let textSliced = val;
                            if (Array.isArray(val)) {
                                textSliced = val.map((text, i) => (
                                    <span key={i}>{text}{i < val.length - 1 ? ", " : ""}</span>
                                ));
                            } else if (typeof val === "string") {
                                textSliced = val.length > 100 
                                ? val.slice(0, 100) + "..."
                                : val;
                            }

                            return (<div key={`${i}${val_i}`} style={rowCol}>
                                <div style={(val_i == 0) ? styles.cellWithIndicator : {}}>
                                    {(val_i == 0) && (
                                        <div style={{
                                            ...styles.indicator,
                                            ...(hoveredRow === i ? styles.indicatorActive : {})
                                        }} />
                                    )}
                                    <span style={styles.cellTextBold}>{textSliced}</span>
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

    // useEffect(() => {}, [content]);

    return (
        <div style={styles.tableBody}>
            {renderContents()}
        </div>
    )
}
