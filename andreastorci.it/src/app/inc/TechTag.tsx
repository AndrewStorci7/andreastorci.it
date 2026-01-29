import React, { useEffect, useState } from "react";
import "@style/techTagStyle.css";

interface TechTagProps {
    // key: string | number,
    type: string 
}

const Techtag: React.FC<TechTagProps> = ({
    // key,
    type
}) => {

    const [style, setStyle] = useState<string>("tech-tag")

    useEffect(() => {
        const newStyle: string = setupStyle(type);
        setStyle(newStyle);
    }, [type])

    return (
        <div className={style}>
            {/* <div className="flex center relative row"> */}
                {type}
            {/* </div> */}
        </div>
    )
}

const setupStyle = (type: string) => {
    switch (type.toLowerCase()) {
        case 'javascript':
            return "tech-tag bg-js";
        case "node.js":
            return "tech-tag bg-node color-white";
        case 'typescript':
            return "tech-tag bg-ts color-white";
        case 'react':
            return 'tech-tag bg-react color-white';
        case 'react native':
            return 'tech-tag bg-reactnative';
        case 'three.js':
            return 'tech-tag bg-threejs';
        case 'mysql':
            return 'tech-tag bg-mysql';
        case 'next.js':
            return 'tech-tag bg-next color-white';
        case 'mongodb':
            return 'tech-tag bg-mongodb color-white'
        default:
            return "tech-tag"
    }
}

export default Techtag;