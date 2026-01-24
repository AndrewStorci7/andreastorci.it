'use client'
import React from "react"

export default function Test() {
    
    React.useEffect(() => {
        fetch("api/test", { method: "POST" })
        .then(res => res.json())
        // .then(data => console.log(data))
    }, []);
    
    return (
        <></>
    )
}