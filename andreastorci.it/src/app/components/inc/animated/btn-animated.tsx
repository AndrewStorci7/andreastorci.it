/**
 * Button for sidebar
 * @author Andrea Storci aka dreean
 */

'use client'

import { useEffect, useState } from "react"
import Icon from "../icon"

interface BtnProps {
    // active?: number
    // index: number,
    // onClick: any,
    useFor: string,
    size?: number,
    refClick: string,
    className?: string,
    onClick?: any,
}

export default function ButtonAnimated({ useFor, onClick, size = 25, refClick, ...props }: BtnProps) {

    const [currentSVG, setCurrentSVG] = useState(0);
    const [clicked, setClicked] = useState(false)
    const [svgs, setSvg] = useState<string[]>([])
    const [effect, setEffect] = useState("")

    // console.log(useFor)

    useEffect(() => {
        const setData = (useFor:string) => {
            // console.log(useFor)
            switch (useFor) {
                case "menu": {
                    setSvg([
                        "menu",
                        "menu-hover",
                    ])
                    setEffect("toggle-svg")
                    break
                }
                case "sidebar": {
                    setSvg([
                        "square-empty",
                        "square",
                    ])
                    setEffect("rotating-svg")
                    break
                }
                default: {
                    setSvg([
                        "square-empty",
                        "square",
                    ])
                    setEffect("rotating-svg")
                    break
                }
            }
        } 

        setData(useFor)
    }, [useFor])
  
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
        onClick()
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
            <div className={effect}>
                <Icon useFor={svgs[currentSVG]} height={size} width={size}/>
            </div>
        </button>
    )
}
