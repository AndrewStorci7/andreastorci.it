import React, { useState } from 'react'
import "./style/main.css"
import { styles } from './style/style';
import { Trash2, Edit2, Plus, Ellipsis, Eye } from 'lucide-react';
import TableAddNewItem from './TableAddNewItem';
import { setStyleCol } from './inc/common';
import { useTable } from './provider/TableContext';
import PersonalInfo from '@ctypes/PersonalInfo';
import { useNotification, usePageSelector } from '@providers';
import Icon from '@inc/Icon';
import { PossibleContent } from '@ctypes';
import { removeUpload } from '@admin/inc/manageFiles';

interface TableContentProps {
    content: PossibleContent,
}

export default function TableContent({
    content,
}: TableContentProps) {

    const { setLoader } = usePageSelector();
    const { settings, attribute, reload } = useTable();
    const { showNotification, hideNotification } = useNotification();

    const [hoveredRow, setHoveredRow] = useState<number>(-1);

    const handleDelete = async (id: number, proceed: boolean = false) => {
        let filename: string | null = null;
        try {
            if (proceed) {
                const pd = new PersonalInfo("it-IT");
                const promiseProjects = await pd.getProjects();
                filename = promiseProjects[id]?.image ?? null;
                const deleteResult = await pd.delete({ attribute: attribute, index: id });
                
                hideNotification()
                
                showNotification({
                    title: (deleteResult.success) ? 
                        "Eliminazione avvenuta con successo!" :
                        "Errore durante l'elimina",
                    message: (deleteResult.success) ? 
                        <span>Elemento eliminato <span className='bold'>{id}</span></span> :
                        <span>
                            Non è stato possibile eliminare l&apos;elemento <span className='bold'>{id}</span> <br/>
                            Errore: <span style={{ fontSize: "10px", fontStyle: "italic" }}>
                                {deleteResult.error}
                            </span>
                        </span>,
                    purpose: "notification",
                    type: (deleteResult.success) ? "completed" : "error",
                    duration: 6000,
                    customIcon: <Icon useFor="announce" width={25} height={25} />,
                });
        
                // elimino l'immagine caricata sul server
                if (attribute === "projects") {
                    await removeUpload(filename, showNotification)
                }
                
                reload();
                
            } else {
                showNotification({
                    title: "Sei sicuro di voler eliminare il progetto ?",
                    message: <p>Stai per eliminare il progetto <br/>Vuoi Procedere ?</p>,
                    purpose: "alert",
                    type: "error",
                    buttons: [
                        { text: "Annulla", type: "default", onClick: () => hideNotification() },
                        { text: "Elimina", type: "cancel", onClick: () => handleDelete(id, true) },
                    ]
                })
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoader(false);
        }
    };

    const handleSeeMoreClick = (content: string | string[], title: string) => {
        
        let contentJSX: React.ReactNode | null = content;
        if (Array.isArray(content)) {
            contentJSX = (
                <ul style={{ paddingLeft: "20px" }}>
                    {content.map((e: string, i: number) => (
                        <li key={i}>{e}</li>
                    ))}
                </ul>
            )
        }

        showNotification({
            title,
            message: (contentJSX) ?? <p className='text-consola text-sm'>{content}</p>,
            purpose: "alert",
            type: "info",
            buttons: [
                { text: "Annulla", type: "default", onClick: () => hideNotification() },
                // { text: "Procedi", type: "confirm", onClick: () => hideNotification() },
            ]
        })
    };

    const renderContents = () => {
        if (!content || !Array.isArray(content)) {
            return (
                <div style={styles.emptyState}>
                    <div style={styles.emptyContent}>
                        <div style={styles.emptyIcon}>
                            <Plus size={32} />
                        </div>
                        <p style={styles.emptyTitle}>Nessun dato disponibile</p>
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
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {e.map((val: any, val_i: number) => {
                            const setting = settings[val_i] ?? {};
                            const rowCol = setStyleCol(setting, "row");
                            const showContent = setting.show ?? true;
                            const title = setting.name;
                            
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
                                    {showContent ? (
                                        <span style={styles.cellTextBold}>
                                            {textSliced} 
                                        </span>
                                    ) : (
                                        <button
                                        onClick={() => handleSeeMoreClick(val, title)}
                                        style={{
                                            ...styles.actionButton,
                                            ...styles.seeMoreButton,
                                            ...styles.actionButtonVisible
                                        }}>
                                            <Eye size={18} />
                                        </button>
                                    )}
                                    {sliced && (
                                        <button
                                        className='absolute see-more-button' 
                                        onClick={() => handleSeeMoreClick(val, title)}
                                        style={{
                                            ...styles.actionButtonMini,
                                            ...styles.seeMoreButton,
                                            ...(hoveredRow === i ? styles.actionButtonVisible : styles.actionButtonHidden)
                                        }}>
                                            <Ellipsis size={10} />
                                        </button>
                                    )}
                                </div>
                            </div>)
                        })}
    
                        <div style={styles.rowCol1}>
                            <button style={{
                                ...styles.actionButton,
                                ...styles.editButton,
                                ...(hoveredRow === i ? styles.actionButtonVisible : styles.actionButtonHidden)
                            }}>
                                <Edit2 size={18} />
                            </button>
                            <button
                                onClick={() => handleDelete(i, )}
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
            <TableAddNewItem />
            {renderContents()}
        </div>
    )
}
