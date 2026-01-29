import React from "react"

export interface PageProp {
    pageId: string
    show?: boolean
    children: React.ReactNode
}

export default function Page({
    pageId,
    show,
    children
}: PageProp) {

    // console.log(pageId)
    if (!show) return null
    return <>{children}</>;
} 