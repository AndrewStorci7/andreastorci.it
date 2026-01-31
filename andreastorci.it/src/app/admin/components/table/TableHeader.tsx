import { setStyleCol } from './inc/common'
import { styles } from './style/style'
import { VoicesProps } from './types'
import React from 'react'
import "./style/main.css"

interface TableHeaderProps {
    voices: VoicesProps[]
}

export default function TableHeader({
    voices
}: TableHeaderProps) {

    const renderVoices = () => {
        if (voices.length == 0)
            throw new Error("La prop `voices` è vuota, devi inserire almeno una voce per la tabella");
        
        return voices.map((e, i) => {

            const headerCol = setStyleCol(e, "header");

            return (
                <div 
                key={i}
                style={headerCol}
                >
                    <p>{e.name}</p>
                </div>
            )
        });
    }

    return (
        <div style={styles.tableHeader}>
            {renderVoices()}
            <div style={styles.headerCol1}><p>Azioni</p></div>
        </div>
    )
}
