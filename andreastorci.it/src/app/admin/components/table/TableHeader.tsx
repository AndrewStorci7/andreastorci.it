import React from 'react'
import { DEFAULT_WIDTH_TABLE, VoicesProps, WIDTH_END } from './types'
import "./style/main.css"
import { styles } from './style/style'
import { setStyleCol } from './inc/common'

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
            // const props: VoicesProps = {
            //     name: e.name,
            //     width: (e.width && e.width > 0) ? e.width : 2,
            //     bold: e.bold ?? true,
            //     centered: e.centered ?? false,
            //     marginAutoLeft: e.marginAutoLeft ?? false,
            //     marginAutoRight: e.marginAutoRight ?? false 
            // }

            const headerCol = setStyleCol(e, "header");

            return (
                <div 
                key={i}
                style={headerCol}
                // style={{
                //     width: props.width === 0 ? `${DEFAULT_WIDTH_TABLE}%` : `${props.width}%`,
                //     marginRight: props.marginAutoRight ? "auto" : "none",
                //     marginLeft: props.marginAutoLeft ? "auto" : "none",
                //     fontWeight: props.bold ? "bold" : "regular"
                // }}
                >
                    {/* <div className={`flex ${props.centered ? "center" : ""}`}> */}
                        <p>{e.name}</p>
                    {/* </div> */}
                </div>
            )
        });
    }

    return (
        <div style={styles.tableHeader}>
            {renderVoices()}
            <div style={styles.headerCol2}><p>Azioni</p></div>
        </div>
    )
}
