import React, { useState } from "react";
import "@astyle/selectItemStyle.css"
import Icon from "@inc/Icon";

const SingleSelect = ({
    name,
    onClick
}: {
    name: string
    onClick?: (arg: string) => void
}) => {

    const [selected, setSelected] = useState<boolean>(false)

    const handleClick = () => {
        onClick?.(name)
        setSelected(prev => !prev)
    }

    return (
        <div className="select-item flex row center pointer gap-4" onClick={handleClick}>
            <div className={`circle ${selected ? "selected" : ""}`}></div>
            <p className={selected ? "bold" : ""}>{name}</p>
            <Icon useFor={name} width={25} height={name == "Go" ? 18 : 25} />
        </div>
    )
}

export default SingleSelect;