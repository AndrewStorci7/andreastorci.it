'use client'
import { usePageSelector, PageSelectorProvider } from "@providers/PageSelectorContext";
import PageSelector from "@admin/components/PageSelector";
import { AuthProvider } from "@providers/AuthContext";
import SideBar from "@admin/components/SideBar";
import "@astyle/globals.css";
import React from "react";

const AdminPageContent = () => {

    const { currentState } = usePageSelector()
    console.log(currentState)

    return (    
        <div className="h-fit-content flex row">
            <div className="left-side sticky-top full-h">
                <SideBar />
            </div>
            <div className="right-side pt-20">
                <PageSelector 
                    // onChange={setCurrentPage} 
                    page={currentState.page} 
                />
            </div>
        </div>
    )
}

const Wrapper = () => {
    return (
        <PageSelectorProvider>
            <AuthProvider>
                <AdminPageContent />
            </AuthProvider>
        </PageSelectorProvider>
    )
} 

const Adminpage = Wrapper;

export default Adminpage;