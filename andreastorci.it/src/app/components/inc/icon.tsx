/**
 * get icon component
 * @author Andrea Storci aka dreean
 */

import Image from "next/image"

interface IconProps {
    useFor: string,
    height?: number,
    width?: number,
    className?: string,
}

export default function Icon({ useFor, height = 50, width = 50, ...props}: IconProps) {
    
    switch (useFor) {
        case "hamburger":
            return <Image {...props} src={'/menu.svg'} alt={"Menu"} height={height} width={width} priority />
        case "square":
            return <Image {...props} style={{ transform: 'rotate(360deg)', transition: 'transform 0.5s', }} src={'/square.svg'} alt={"Rounded Square"} height={height} width={width} priority />
        case "square-empty":
            return <Image {...props} style={{ transform: 'rotate(305deg)', transition: 'transform 0.5s', }} src={'/square-empty.svg'} alt={"Rounded Square"} height={height} width={width} priority /> /*style={{ transform: 'rotate(55deg)', transition: 'transform 0.5s', }} */
        default:
            return <></>
    }
}
