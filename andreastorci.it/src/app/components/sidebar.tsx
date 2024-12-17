import Image from "next/image";

/**
 * Sidebar Menu
 * 
 * @author Andrea Storci aka dreean
 * @returns 
 */
export default function Sidebar() {
    return (
        <div className="sidebar">
            
            {/* Avatar */}
            <div className="grid grid-cols-3 w-full h-fit">
                <div className="rounded-full">
                    <Image 
                        // className="dark:invert"
                        className="rounded-[4px]"
                        src="/me.webp"
                        alt="Andrea Storci image"
                        width={180}
                        height={10}
                        priority
                    />
                </div>
                <div className="grid avatar-entry font-poppins content-center">
                    <h1>Andrea Storci</h1>
                    <h3><span className="text-flax span-underline">Software</span> & <span className="text-picton-blue span-underline">web</span> developer</h3>
                </div>
            </div>
            
            {/* Divisore */}
            <hr className="divisor" />
            
            {/* Menu */}
            <div>

            </div>

            {/* Divisore */}
            <hr className="divisor" />

            
        </div>
    )
}
