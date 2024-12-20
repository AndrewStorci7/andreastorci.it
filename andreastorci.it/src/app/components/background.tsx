/**
 * Background component
 * @author Andrea Storci aka dreean
 */

'use client'

import Image from "next/image" 
import { useEffect, useState } from "react"

export default function Background() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const [speed, setSpeed] = useState(100)

    useEffect(() => {
        const handleMouseMove = (event:any) => {
            setMousePosition({
                x: event.clientX,
                y: event.clientY
            })
        }

        window.addEventListener("mousemove", handleMouseMove)

        return () => {
            window.removeEventListener("mousemove", handleMouseMove)
        }
    }, [])

    return (
        <div className="absolute z-[-2] w-full">
            <div className="flex flex-row h-[862px]">
                {/* <div className="w-[68%] h-[70vh] bg-sandy"></div>
                <div className="w-[32%] h-[70vh] bg-purple-light"></div> */}
                
                <div className="w-[68%] h-[862px] bg-purple"></div>
                <div className="w-[32%] h-[862px] bg-sandy"></div>
            </div>
        </div>
    )
}
