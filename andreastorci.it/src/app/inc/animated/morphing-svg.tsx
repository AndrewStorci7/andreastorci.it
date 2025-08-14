/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Animated button
 * @author Andrea Storci aka dreean
 */
import { motion } from "framer-motion" 

interface MorphingSVGProps {
    toggle: boolean,
    setToggle: any,
}

export default function MorphingSVG({ toggle, setToggle }: MorphingSVGProps) {

    const squareEmpty = "M175 906 c-41 -18 -83 -69 -90 -109 -3 -18 -5 -163 -3 -324 3 -276 4 -293 24 -319 11 -15 33 -37 48 -48 26 -20 40 -21 345 -21 l318 0 35 27 c68 52 69 61 66 402 -3 290 -4 306 -24 332 -11 15 -33 37 -48 48 -26 20 -42 21 -334 23 -240 2 -314 0 -337 -11z m667 -64 l33 -32 0 -310 0 -310 -33 -32 -32 -33 -310 0 -310 0 -32 33 -33 32 0 309 0 309 25 27 c14 15 34 31 45 36 11 4 154 7 317 6 l298 -2 32 -33z"
    const square = "M175 906 c-41 -18 -83 -69 -90 -109 -3 -18 -5 -163 -3 -324 3 -276 4 -293 24 -319 11 -15 33 -37 48 -48 26 -20 40 -21 346 -21 306 0 320 1 346 21 15 11 37 33 48 48 20 26 21 40 21 346 0 306 -1 320 -21 346 -11 15 -33 37 -48 48 -26 20 -42 21 -334 23 -240 2 -314 0 -337 -11z"
    
    return (
        <div className="flex flex-col items-center">
            <button
                onClick={() => setToggle(!toggle)}
                className="mt-4 px-4 py-2 text-white bg-indigo-500 rounded-lg hover:bg-indigo-700 transition"
            >
                <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 0 0"
                    className="w-[25px] h-[25px]"
                    onClick={() => setToggle(!toggle)}
                >
                    <motion.path
                    d={toggle ? square : squareEmpty}
                    fill="transparent"
                    stroke="indigo"
                    strokeWidth="3"
                    transition={{
                        duration: 1.5,
                        ease: 'easeInOut',
                    }}
                    />
                </motion.svg>
            </button>
        </div>
    )
}
