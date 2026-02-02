import React from "react"

// const fixButtonMarginBottom: Record<string, React.CSSProperties> = {
//     fixButton: {
//         marginBottom: 0,
//     }
// }

export const styles: Record<string, React.CSSProperties> = {
    container: {
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #0f172a, #1e293b, #0f172a)',
        padding: '2rem'
    },
    wrapper: {
        maxWidth: '72rem',
        margin: '0 auto'
    },
    header: {
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    title: {
        fontSize: '1.875rem',
        fontWeight: 'bold',
        color: 'white',
        marginBottom: '0.5rem'
    },
    subtitle: {
        color: '#94a3b8'
    },
    addButton: {
        display: 'flex',
        alignItems: 'center',
        fontSize: "15px",
        gap: '0.5rem',
        backgroundImage: 'linear-gradient(to right, #2973EA, #6A8BC4)',
        backgroundSize: '200% auto',
        backgroundPosition:'left',
        color: 'white',
        padding: '0.75rem 1.5rem',
        margin: "10px",
        borderRadius: '0.75rem',
        fontWeight: '500',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.3s',
        boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.3)'
    },
    addButtonHovered: {
        // ...fixButtonMarginBottom.fixButton,
        // backgroundImage: 'linear-gradient(to right, #8AB5F9, #8FAFF5)',
        backgroundPosition:'right center',
    },
    addingRow: {
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderLeft: '3px solid #3b82f6',
        animation: 'slideIn 0.3s ease-out'
    },
    tableContainer: {
        backgroundColor: 'rgba(30, 41, 59, 0.5)',
        backdropFilter: 'blur(8px)',
        borderRadius: '0.5rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        border: '1px solid rgba(51, 65, 85, 0.5)',
        overflow: 'hidden'
    },
    tableHeader: {
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gap: '1rem',
        padding: '1rem 1.5rem',
        background: 'linear-gradient(to right, rgba(51, 65, 85, 0.5), rgba(30, 41, 59, 0.5))',
        borderBottom: '1px solid #334155'
    },
    headerColFull: {
        gridColumn: 'span 12',
        fontSize: '0.875rem',
        fontWeight: '600',
        color: '#cbd5e1',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
    },
    headerCol3: {
        gridColumn: 'span 3',
        fontSize: '0.875rem',
        fontWeight: '600',
        color: '#cbd5e1',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
    },
    headerCol4: {
        gridColumn: 'span 4',
        fontSize: '0.875rem',
        fontWeight: '600',
        color: '#cbd5e1',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
    },
    headerCol5: {
        gridColumn: 'span 5',
        fontSize: '0.875rem',
        fontWeight: '600',
        color: '#cbd5e1',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
    },
    headerCol2: {
        gridColumn: 'span 2',
        fontSize: '0.875rem',
        fontWeight: '600',
        color: '#cbd5e1',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        // textAlign: 'right'
    },
    headerCol1: {
        gridColumn: 'span 1',
        fontSize: '0.875rem',
        fontWeight: '600',
        color: '#cbd5e1',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        // textAlign: 'right'
    },
    tableBody: {
        borderTop: '1px solid rgba(51, 65, 85, 0.5)'
    },
    tableRow: {
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gap: '1rem',
        padding: '0.5rem 1.5rem',
        transition: 'all 0.3s',
        backgroundColor: 'transparent',
        borderBottom: '1px solid rgba(51, 65, 85, 0.5)'
    },
    tableAddRow: {
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gap: '1rem',
        // padding: '0.5rem 1.5rem',
        transition: 'all 0.3s',
        backgroundColor: '#9DABC1',
        borderBottom: '1px solid rgba(51, 65, 85, 0.5)'
    },
    tableRowHovered: {
        backgroundColor: 'rgba(51, 65, 85, 0.3)',
        transform: 'scale(1.001)'
    },
    tableAddRowHovered: {
        backgroundColor: '#8394AF',
        transform: 'scale(1.01)'
    },
    rowColFull: {
        gridColumn: 'span 12',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    rowCol3: {
        gridColumn: 'span 3',
        display: 'flex',
        alignItems: 'center'
    },
    rowCol4: {
        gridColumn: 'span 4',
        display: 'flex',
        alignItems: 'center'
    },
    rowCol5: {
        gridColumn: 'span 5',
        display: 'flex',
        alignItems: 'center'
    },
    rowCol2: {
        gridColumn: 'span 2',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: '0.5rem'
    },
    rowCol1: {
        gridColumn: 'span 1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: '0.5rem'
    },
    cellWithIndicator: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
    },
    indicator: {
        width: '0.5rem',
        height: '0.5rem',
        borderRadius: '50%',
        backgroundColor: '#475569',
        transition: 'all 0.3s'
    },
    indicatorActive: {
        backgroundColor: '#3b82f6',
        transform: 'scale(1.5)'
    },
    indicatorNew: {
        width: '0.5rem',
        height: '0.5rem',
        borderRadius: '50%',
        backgroundColor: '#3b82f6',
        animation: 'pulse 2s infinite'
    },
    cellTextBold: {
        color: '#e2e8f0',
        fontWeight: '500'
    },
    cellText: {
        color: '#cbd5e1'
    },
    actionButton: {
        // ...fixButtonMarginBottom.fixButton,
        padding: '0.5rem',
        borderRadius: '0.5rem',
        transition: 'all 0.3s',
        border: 'none',
        cursor: 'pointer'
    },
    actionButtonMini: {
        padding: '0.4rem 0.5rem',
        borderRadius: '0.5rem',
        transition: 'all 0.3s',
        border: 'none',
        cursor: 'pointer'
    },
    actionButtonVisible: {
        transform: 'scale(1)',
        opacity: 1
    },
    actionButtonHidden: {
        transform: 'scale(0)',
        opacity: 0,
        color: '#64748b'
    },
    editButton: {
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        color: '#60a5fa'
    },
    seeMoreButton: {
        backgroundColor: 'rgba(169, 187, 215, 0.2)',
        color: '#D5D5D5'
    },
    deleteButton: {
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        color: '#f87171'
    },
    saveButton: {
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        color: '#4ade80',
        transform: 'scale(1)',
        opacity: 1
    },
    cancelButton: {
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        color: '#f87171',
        transform: 'scale(1)',
        opacity: 1
    },
    emptyState: {
        padding: '4rem 0',
        textAlign: 'center'
    },
    emptyContent: {
        color: '#64748b',
        marginBottom: '1rem'
    },
    emptyIcon: {
        width: '4rem',
        height: '4rem',
        margin: '0 auto 1rem',
        borderRadius: '50%',
        backgroundColor: 'rgba(51, 65, 85, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    emptyTitle: {
        fontSize: '1.125rem',
        fontWeight: '500'
    },
    emptySubtitle: {
        fontSize: '0.875rem',
        marginTop: '0.5rem'
    },
    footer: {
        marginTop: '1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.875rem',
        color: '#94a3b8'
    },
    footerBold: {
        color: 'white',
        fontWeight: '600'
    },
    input: {
        width: '100%',
        padding: '0.5rem 0.75rem',
        backgroundColor: 'rgba(30, 41, 59, 0.5)',
        border: '1px solid #475569',
        borderRadius: '0.5rem',
        color: '#e2e8f0',
        fontSize: '0.875rem',
        outline: 'none',
        transition: 'all 0.3s'
    },
};