/**
 * Get Icons component
 * @author Andrea Storci aka dreean
 * 
 * @prop {string} useFor
 */

import Image from "next/image"

interface IconsProps {
    useFor: string,
    height?: number,
    width?: number,
}

export default function Icon({ useFor, height = 50, width = 50 }: IconsProps) {
    
    switch (useFor) {
        case "hamburger":
            return <Image src={'/icons8-hamburger.svg'} alt="Menu icon" height={height} width={width} priority />
    }
}
