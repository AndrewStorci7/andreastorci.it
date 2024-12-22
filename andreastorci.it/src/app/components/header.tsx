/**
 * Header component
 * @author Andrea Storci aka dreean
 */

'use client'

import { useState } from "react";
import ButtonAnimated from "./inc/animated/btn-animated";
import TinyMenu from "./tiny/tiny-menu";
import Image from "next/image";

export default function Header() {

    const [click, setClick] = useState(false)

    return (
        <header className="relative w-full py-[40px] z-[999]">
            <div className="flex flex-row">
                <div className="relative w-[200px] h-[50px]">
                    <Image className="absolute top-[-20px]" src={'/logo.webp'} alt="Logo" height={100} width={300} priority />
                </div>
                <div className="grow"></div>
                <div className="w-[50px] h-[50px] relative">
                    <ButtonAnimated 
                        useFor="menu"
                        size={50}
                        refClick="#"
                        onClick={() => setClick(!click)}
                    />
                    <TinyMenu visible={click} />
                </div>
            </div>
        </header>
    )
}
