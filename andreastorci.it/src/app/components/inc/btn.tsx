/**
 * Button for sidebar
 * @author Andrea Storci aka dreean
 */

'use client'

import { useEffect, useState } from "react"
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
    const [clicked, setClicked] = useState(false)
    const [size, setSize] = useState(25)

    const svgs = [
        "square-empty",
        "square",
    ];
  
    const handleSwitch = (enter:boolean) => {
        setCurrentSVG((prev) => {
            if (!clicked) {
                if (enter) {
                    return (prev + 1) % svgs.length;
                } else {
                    return (prev - 1 + svgs.length) % svgs.length; // Ensure non-negative index
                }
            } else {
                return 1
            }
        })
    };

    const handleClick = () => {
        setCurrentSVG(1)
        setClicked(!clicked)
    }

    return (
        <button
        // onClick={}
        className="my-[5px]"
        onClick={handleClick}
        onMouseEnter={() => handleSwitch(true)}
        onMouseLeave={() => handleSwitch(false)}
        {...props}
        >
            <div className="rotating-svg">
                <Icon useFor={svgs[currentSVG]} height={size} width={size}/>
            </div>
        </button>
    )
}
