import React from "react";
import { useProjectContext } from "@/admin/components/provider/ProjectContext";
import Image from "next/image";

const Switch = () => {

    const { currentState, switchType } = useProjectContext()

    return (
        <div className="pointer switch-container flex center row gap-5" onClick={switchType}>
            <div className={`button ${currentState.type == 'list' ? '' : 'switched'}`} />
            <div className="switch-to-list center">
                <Image width={25} height={25} src={'/svg/dev.svg'} alt="Dev" />
            </div>
            <div className="switch-to-preview center">
                <Image width={25} height={25} src={'/svg/preview.svg'} alt="Preview" />
            </div>
        </div>
    )
}

export default Switch;