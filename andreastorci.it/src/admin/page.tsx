'use client'
import PageSelector from "@admin/components/PageSelector";
import { 
    AuthProvider, 
    NotificationProvider, 
    PageSelectorProvider, 
    usePageSelector 
} from "@providers";
import SideBar from "@admin/components/SideBar";
import "@astyle/globals.css";
import React from "react";

const AdminPageContent = () => {

    const { currentPage } = usePageSelector()
    // console.log(currentState)

    return (    
        <div className="h-fit-content flex row">
            <div className="left-side sticky-top full-h">
                <SideBar />
            </div>
            <div className="right-side pt-20">
                <PageSelector 
                    // onChange={setCurrentPage} 
                    page={currentPage.page} 
                />
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