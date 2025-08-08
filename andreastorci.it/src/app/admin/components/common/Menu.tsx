import React, { useEffect, useState } from "react";
import "@astyle/menuStyle.css";
import hash from 'string-hash'
import { useMenuPageSelector, usePageSelector } from "@providers";

const Menu = ({
    menuId,
    items,
    size = "full",
    // onChange
}: {
    menuId: string
    items: Map<string, any>,
    size?: number | string,
    // onChange: (sku: string, pageId: string) => void
}) => {

    const { setSubTitle } = usePageSelector()
    const { setPage } = useMenuPageSelector()
    const [defaultPage, setDefaultPage] = useState<string>()
    const [selected, setSelected] = useState<number>()

    const handleClick = (index: number, id: string, name: string) => {
        setDefaultPage(String(hash(id)))
        setSelected(index)
        setPage(menuId, id)
        setSubTitle(name)
    }

    const renderMenuItems = (items: Map<string, any> | undefined) => {
        if (!items || !(items instanceof Map) || items.size <= 1) {
            throw new Error("Per poter utilizzare la componente `Menu` bisogna inserire un array di `items` con almeno 2 elementi")
        }

        const map = Array.from(items.entries())
        if (!map || map.length === 0) return;
        const size = map?.length;
        
        return (
            <div className={`grid no-gap grid-col-${size}`}>
                {map.map(([name, val], index) => {
                    const isSelected = defaultPage === val.pageId || selected === index
                    return (
                        <div key={index} className={`menu-item ${val.disabled ? "disabled" : ""} ${isSelected  ? "selected" : ""}`} onClick={() => !val.disabled && handleClick(index, val.pageId, name)}>
                            <p className="">{name}</p>
                        </div>
                    )
                })}
            </div>   
        )
    }

    useEffect(() => {
        if (!menuId || menuId === "") {
            throw new Error("la props `menuId` non puo' essere `null` o vuota")
        }

        if (!items || !(items instanceof Map) || items.size <= 1) {
            throw new Error("Per poter utilizzare la componente `Menu` bisogna inserire un array di `items` con almeno 2 elementi")
        }

        const [firstitemName, firstitemPageid] = items.entries().next().value || []
        setDefaultPage(firstitemPageid?.pageId)
        setPage(menuId, firstitemPageid?.pageId)
        setSubTitle(String(firstitemName))
    }, [])

    return (
        <div className={`horizontal-menu !size-${size}`}>
            {renderMenuItems(items)}
        </div>
    )
}

export default Menu