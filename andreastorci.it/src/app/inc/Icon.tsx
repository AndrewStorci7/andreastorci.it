/**
 * get icon component
 * @author Andrea Storci aka dreean
 */
'use client'
import Image from "next/image";

import "@style/iconStyle.css"
import { CSSProperties, useState } from "react";

interface IconProps {
    useFor: string;
    height?: number;
    width?: number;
    className?: string;
    style?: CSSProperties | undefined;
}

export default function Icon({ useFor, height = 50, width = 50, ...props}: IconProps) {
    
    const [clicked, setClicked] = useState<boolean>(true)
    const [hamburgerStyleClick, setStyleClick] = useState<string[]>([])
    const handleClick = () => {
        setStyleClick(clicked ? [ "menu-clicked-lt", "menu-clicked-lc", "menu-clicked-lb" ] : []);
        setClicked(prev => !prev);
    }

    switch (useFor.toLowerCase()) {
        case "hamburger":
            return (
                <div onClick={handleClick}>
                    <div className={`menu-hamburger-line ${hamburgerStyleClick[0] ?? ""}`} />
                    <div className={`menu-hamburger-line ${hamburgerStyleClick[1] ?? ""}`} />
                    <div className={`menu-hamburger-line ${hamburgerStyleClick[2] ?? ""}`} />
                </div>
            )
        case "square":
            return <Image {...props} style={{ transform: 'rotate(360deg)', transition: 'transform 0.5s', }} src={'/square.svg'} alt={"Rounded Square"} height={height} width={width} priority />
        case "square-empty":
            return <Image {...props} style={{ transform: 'rotate(305deg)', transition: 'transform 0.5s', }} src={'/square-empty.svg'} alt={"Rounded Square"} height={height} width={width} priority /> /*style={{ transform: 'rotate(55deg)', transition: 'transform 0.5s', }} */
        case "modify":
            return <Image {...props} width={width} height={height} src={'/svg/edit.svg'} alt="Edit" />
        case "delete":
            return <Image {...props} width={width} height={height} src={'/other/delete.png'} alt="Delete" />
        case "javascript":
            return <Image {...props} width={width} height={height} src={'/tech/js.png'} alt="Javascript" />
        case "typescript":
            return <Image {...props} width={width} height={height} src={'/tech/ts.png'} alt="Typescript" />
        case "next.js":
            return <Image {...props} width={width} height={height} src={'/tech/next.png'} alt="Next.js" />
        case "c++":
            return <Image {...props} width={width} height={height} src={'/tech/cpp.png'} alt="C plus plus" />
        case "java":
            return <Image {...props} width={width} height={height} src={'/tech/java.png'} alt="Java" />
        case "node.js":
            return <Image {...props} width={width} height={height} src={'/tech/node.png'} alt="Node.js" />
        case "react native":
        case "react":
            return <Image {...props} width={width} height={height} src={'/tech/react.png'} alt="React" />
        case "go":
            return <Image {...props} style={{ backgroundColor: "#007d9c" }} width={width} height={height} src={'/tech/go.svg'} alt="Go" />
        case "python":
            return <Image {...props} width={width} height={height} src={'/tech/python.png'} alt="Python" />
        case "c#":
            return <Image {...props} width={width} height={height} src={'/tech/csharp.png'} alt="C sharp" />
        default:
            return <></>
    }
}
