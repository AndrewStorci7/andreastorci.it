'use client'
import { PageSelectorProvider, usePageSelector } from "@/admin/components/provider";
import { Project } from "@/types";
import PersonalInfo from "@/types/PersonalInfo"
import React, { useEffect } from "react"

function TestWrapped() {

    const { setLoader } = usePageSelector();
    const pd = new PersonalInfo("it-IT");

    const testTranslate = async () => {
        const pd = new PersonalInfo("it-IT");
        const projects: Project[] = await pd.getProjects();
        pd.translate("en-GB", projects[0])
    }

    useEffect(() => {
        setLoader(true, "Traduzione in corso ...");
        // testTranslate().finally(() => setLoader(false));
    }, []);

    return (
        <button onClick={testTranslate}>
            Translate
        </button>
    )
}

export default function Test() {

    return (
        <PageSelectorProvider>
            <TestWrapped />
        </PageSelectorProvider>
    )
}