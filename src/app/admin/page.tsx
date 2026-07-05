'use client'
import { AuthProvider, NotificationProvider, PageSelectorProvider, usePageSelector } from "@providers";
import PageSelector from "@admin/components/PageSelector";
import SideBar from "@admin/components/SideBar";
import "@astyle/globals.css";
import React from "react";

const AdminPageContent = () => {

    const { currentPage } = usePageSelector()

    return (    
        <div className="h-fit-content flex row">
            <div className="left-side sticky-top full-h">
                <SideBar />
            </div>
            <div className="right-side pt-20">
                <PageSelector page={currentPage.page} />
            </div>
        </div>
    )
}

const Wrapper = () => {
    return (
        <NotificationProvider>
            <PageSelectorProvider>
                <AuthProvider>
                    <AdminPageContent />
                </AuthProvider>
            </PageSelectorProvider>
        </NotificationProvider>
    )
} 

const Adminpage = Wrapper;

export default Adminpage;