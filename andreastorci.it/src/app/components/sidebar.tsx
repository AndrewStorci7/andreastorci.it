/**
 * Sidebar Menu
 * 
 * @author Andrea Storci aka dreean
 * 
*/

'use client'

import Btn from "./inc/btn"
import MorphingSVG from "./inc/animated/morphing-svg"
import { useEffect, useState } from "react"

export default function Sidebar() {


    return (
        <div className="fixed w-[8vw] top-[45%] left bg-white right-[0px]">
            <Btn 
                refClick="#" 
                className="absolute" 
            />
            <Btn 
                refClick="#" 
                className="absolute top-[40px]"
            />
            <Btn 
                refClick="#" 
                className="absolute top-[80px]" 
            />
            <Btn 
                refClick="#" 
                className="absolute top-[120px]" 
            />

            {/* <Icon className="my-[5px] fixed" useFor="square" height={30} width={30}/>
            <Icon className="my-[5px] absolute top-[40px]" useFor="square-empty" height={25} width={25}/>
            <Icon className="my-[5px] absolute top-[80px]" useFor="square-empty" height={25} width={25}/>
            <Icon className="my-[5px] absolute top-[120px]" useFor="square-empty" height={25} width={25}/> */}
        </div>
    )
}
