import React, { useEffect, useState } from "react";
import SingleSelect from "./SingleSelect";

const MultipleSelect = ({
    id = '',
    onChange
}: {
    id?: string,
    onChange?: (arg: string[]) => void
}) => {

    const [selectedItems, setSelectedItems] = useState<string[]>([])

    const handleClick = (name: string) => {
        setSelectedItems(prev => {
            if (prev.includes(name)) {
                return prev.filter(item => item !== name)
            } else {
                return [...prev, name];
            }
        })
    }

    useEffect(() => {
        onChange?.(selectedItems)
        // console.log(selectedItems)
    }, [selectedItems])

    return (
        <div id={id} className="grid grid-col-2">
            <div>
                <SingleSelect onClick={handleClick} name="JavaScript" />
                <SingleSelect onClick={handleClick} name="TypeScript" />
                <SingleSelect onClick={handleClick} name="Next.js" />
                <SingleSelect onClick={handleClick} name="C++" />
                <SingleSelect onClick={handleClick} name="Java" />
                <SingleSelect onClick={handleClick} name="C#" />
            </div>
            <div>
                <SingleSelect onClick={handleClick} name="React" />
                <SingleSelect onClick={handleClick} name="React Native" />
                <SingleSelect onClick={handleClick} name="Node.js" />
                <SingleSelect onClick={handleClick} name="Go" />
                <SingleSelect onClick={handleClick} name="Python" />
            </div>
        </div>
    )
}

export default MultipleSelect;