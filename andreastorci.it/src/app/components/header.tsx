/**
 * Header component
 * @author Andrea Storci aka dreean
 */

import Icon from "./inc/icon";



export default function Header() {
    return (
        <div className="w-screen px-[120px] py-[40px]">
            <div className="flex flex-row">
                <div className="w-[50px] h-[50px] bg-white">

                </div>
                <div className="grow"></div>
                <div className="w-[50px] h-[50px]">
                    <Icon useFor="hamburger" />
                </div>
            </div>
        </div>
    )
}
