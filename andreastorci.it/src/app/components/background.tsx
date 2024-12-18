/**
 * Background component
 * @author Andrea Storci aka dreean
 */

'use client'

import Image from "next/image" 
import { useEffect, useState } from "react"

export default function Background() {

    const [elements, setElements] = useState<{ top: number; left: number }[]>([])

    useEffect(() => {
        const generateRandomPositions = () => {
            const positions = Array.from({ length: 20 }, () => ({
                top: Math.floor(Math.random() * 800),
                left: Math.floor(Math.random() * window.innerWidth),
            }))
            setElements(positions)
        }

        generateRandomPositions()
    }, [])

    return (
        <div className="fixed z-[-1] w-screen">
            <div className="flex flex-row h-[90hv]">
                {/* <div className="w-[68%] h-[90vh] bg-russian"></div>
                <div className="w-[32%] h-[90vh] bg-turquoise"></div>

                <div className="w-[68%] h-[70vh] bg-russian"></div>
                <div className="w-[32%] h-[70vh] bg-sandy"></div>
                
                <div className="w-[68%] h-[70vh] bg-purple"></div>
                <div className="w-[32%] h-[70vh] bg-turquoise"></div> */}
                
                <div className="w-[68%] h-[90vh] bg-purple"></div>
                <div className="w-[32%] h-[90vh] bg-sandy"></div>
                
            </div>
            <div className="fixed top-[200px] w-screen">
                {/* {elements.map((pos, i) => {
                    var top = pos.top
                    var left = pos.left
                    return (
                        <Image 
                        key={i}
                        className={`absolute top-[${top}px] left-[${left}px]`} 
                        style={{
                            top: `${top}px`,
                            left: `${left}px`
                        }}
                        src={'/scribbles-scribbles-81.svg'} 
                        alt="scrubble" 
                        height={100} 
                        width={100} 
                        priority
                        />
                    )
                })} */}
                {/* <Image className="absolute top-[400px] right-[500px]" src={'/prova2.svg'} alt="scrubble" height={200} width={200} /> */}
                <Image className="absolute top-[400px] right-[500px]" src={'/stripes.svg'} alt="scrubble" height={200} width={200} />
            </div>
        </div>
    )
}
