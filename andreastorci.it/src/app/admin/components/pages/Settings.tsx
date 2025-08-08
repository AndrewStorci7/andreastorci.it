import React, { Children, ReactNode } from "react";
import Menu from "@common/Menu";
import { MenuPageSelectorProvider, useMenuPageSelector } from "@providers";
import Page, { PageProp } from "./subpages/Page";

const menuItems = new Map<string, any>([
    ["Generali", { pageId: "general", onClick: () => {} }],
    ["Pannello", { pageId: "admin-panel", onClick: () => {} }],
    ["Lingue Traduzioni", { pageId: "translations", onClick: () => {} }],
    ["Site template", { disabled: true, pageId: "site-template", onClick: () => {} }],
])

const Settings = ({ children }: { children: ReactNode }) => {

    const { currentState } = useMenuPageSelector()

    const renderSettingPage = Children.map(children, (child) => {
        if (!React.isValidElement<PageProp>(child)) throw new Error("Si sta cercando renderizzare la componente `Settings` con un `child` non valido");

        return React.cloneElement(child, {
            show: child.props.pageId === currentState.page,
        });
    })

    return renderSettingPage
}

const SettingsPage = () => {
    return (
        <MenuPageSelectorProvider 
            menu={
                <Menu 
                    menuId={"menu-settings"} 
                    items={menuItems} 
                    // onChange={(sku, pageId) => setPage(sku, pageId)} 
                />
            }
        >
            <Settings>
                <Page pageId="general" >Genaral</Page>
                <Page pageId="admin-panel" >Admin Panel</Page>
                <Page pageId="translations" >Translations</Page>
                <Page pageId="site-template" >Site Template</Page>
            </Settings>
        </MenuPageSelectorProvider>
    )
}

export default SettingsPage;