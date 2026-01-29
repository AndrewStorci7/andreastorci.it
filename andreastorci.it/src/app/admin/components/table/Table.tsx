import { useTable } from './provider/TableContext';
import TableContent from './TableContent';
import TableHeader from './TableHeader';
import React, { useState } from 'react';
import { styles } from './style/style';
import { Plus } from 'lucide-react';

interface TableProps {
    // voices: VoicesProps[],
    // contents: any[],
    // addData?: Function
}

export default function Table({
    // voices,
    // contents,
    // addData
}: TableProps) {

    const { settings, setShowAdd, contents } = useTable();

    const [hovered, setHovered] = useState<boolean>(false);
    // const [showAdd, setShowAdd] = useState<boolean>(false);

    const onClick = () => {
        // handlerForAdd?.()
        // setShowAdd(prev => !prev);
        setShowAdd();
    }

    return (
        <>
            <button
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className='' 
            style={{
                ...styles.actionButton,
                ...styles.addButton,
                ...(hovered ? styles.addButtonHovered : {})
            }}
            onClick={onClick}
            >
                <Plus size={12} />
                Aggiungi
            </button>
            <div style={styles.tableContainer}>
                <TableHeader voices={settings} />
                <TableContent content={contents} 
                // showAddRow={showAdd} 
                />
            </div>
        </>
    )
}
