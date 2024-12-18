/**
 * Button for sidebar
 * @author Andrea Storci aka dreean
 */

'use client'

import { useEffect, useState } from "react"
import Icon from "./icon"

interface BtnProps {
    refClick: string,
    className?: string,
}

export default function Btn({ refClick, ...props }: BtnProps) {

    const [currentSVG, setCurrentSVG] = useState(0);

    const svgs = [
        "square-empty",
        "square",
    ];
  
    const handleSwitch = () => {
        setCurrentSVG((prev) => (prev + 1) % svgs.length);
    };

    const [isClicked, setClicked] = useState(false)
    const [size, setSize] = useState(25)
    const [icon, setIcon] = useState("")

    useEffect(() => {

    })

    return (
        <button
        // onClick={}
        className="my-[5px]"
        onClick={handleSwitch}
        {...props}
        >
            <div className="rotating-svg">
                <Icon useFor={svgs[currentSVG]} height={size} width={size}/>
            </div>
        </button>
    )
}
