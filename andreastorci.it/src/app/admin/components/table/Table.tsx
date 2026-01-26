import React, { useEffect } from 'react'
import { VoicesProps } from './types'
import TableHeader from './TableHeader';
import TableContent from './TableContent';
import { styles } from './style/style';

interface TableProps {
    voices: VoicesProps[],
    contents: any[]
}

export default function Table({
    voices,
    contents
}: TableProps) {

    useEffect(() => {
        if (voices.length == 0)
            throw new Error("La props `voices` deve almeno contenere un elemento, non può essere vuota");
        // if (contents.length == 0)
        //     throw new Error("La props `contents` deve almeno contenere un elemento, non può essere vuota");
        // if (voices.length !== contents.length)
        //     throw new Error(`Il numero degli elementi di \`voices\` e di \`contents\` non conicidono: numero degli elementi di \`voices\` -> ${voices.length}, numero degli elementi di \`contents\` -> ${contents.length}`)
    }, [voices, contents])

    return (
        <div style={styles.tableContainer}>
            <TableHeader voices={voices} />
            <TableContent content={contents} settings={voices} />
        </div>
    )
}
