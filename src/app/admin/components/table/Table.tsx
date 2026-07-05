import { useTable } from './provider/TableContext';
import TableContent from './TableContent';
import TableHeader from './TableHeader';
import React, { useState } from 'react';
import { styles } from './style/style';
import { Plus } from 'lucide-react';

export default function Table() {

    const { settings, setShowAdd, contents } = useTable();

    const [hovered, setHovered] = useState<boolean>(false);

    const onClick = () => {
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
                <TableContent content={contents} />
            </div>
        </>
    )
}
