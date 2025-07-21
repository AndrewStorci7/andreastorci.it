/**
 * Button for sidebar
 * @author Andrea Storci aka dreean
 */

'use client'

import { useState } from "react"
import Icon from "./icon"

interface BtnProps {
    // active?: number
    // index: number,
    // onClick: any,
    refClick: string,
    className?: string,
}

export default function Btn({ refClick, ...props }: BtnProps) {

    const [currentSVG, setCurrentSVG] = useState(0);
    const [size, setSize] = useState(25)

    const svgs = [
        "square-empty",
        "square",
    ];
  
    const handleSwitch = () => {
        setCurrentSVG((prev) => (prev + 1) % svgs.length);
    };

    // const [isClicked, setClicked] = useState(false)
    // const [icon, setIcon] = useState("")

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
