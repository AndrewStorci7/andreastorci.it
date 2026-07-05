/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import "@astyle/generalButtonsGroupStyle.css" 

const GeneralButtonsGroup = ({
    buttonsValues = [],
    onChange = () => {},
    defaultSelected = buttonsValues[0],
    ...props
}: {
    buttonsValues: string[],
    onChange: (e: any) => void,
    defaultSelected?: string
}) => {

    const [columns, setColumns] = useState<number>() 
    const [selected, setSelect] = useState<string>(defaultSelected)

    useEffect(() => {
        if (buttonsValues.length < 2) {
            throw new Error("buttonsValue deve contenere almeno 2 valori")
        } else {
            setColumns(buttonsValues.length)
        }
    }, [buttonsValues, selected])

    const handleChangeSelect = (val: any) => {
        // onChange && onChange(val)
        onChange(val)
        setSelect(String(val))
    }

    const renderButtons = (values: string[]) => {
        if (!values || values.length === 0) {
            return;
        }

        return values.map((value, index) => {
            const disabled = value.startsWith('!');
            const val = value.startsWith('!') ? value.substring(1) : value;
            return <div 
                        key={index} 
                        className={`flex center ${disabled ? "disabled" : ""} ${selected === val ? "selected" : ""}`} 
                        onClick={() => !disabled && handleChangeSelect(val)}
                    >
                        <p>{val}</p>
                    </div>
        })
    }

    return (
        <div {...props} className={`grid grid-col-${columns} flex center no-gap switch-range buttons-${columns} pointer`}>
            {renderButtons(buttonsValues)}
        </div>
    )
}

export default GeneralButtonsGroup;