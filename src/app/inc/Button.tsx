/**
 * Button for sidebar
 * @author Andrea Storci aka dreean
 */

'use client'

import { useEffect, useState } from "react"
import Icon from "@inc/Icon"

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
    const [, setRef] = useState(refClick)

    const svgs = [
        "square-empty",
        "square",
    ];
  
    const handleSwitch = () => {
        setCurrentSVG((prev) => (prev + 1) % svgs.length);
    };

    useEffect(() => {
        setSize(25)
        setRef(refClick)
    }, [])

    return (
        <button
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
