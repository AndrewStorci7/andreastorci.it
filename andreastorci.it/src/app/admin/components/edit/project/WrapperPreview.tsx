import React, { ReactNode, useEffect, useState } from "react";

import { useProjectContext } from "@/admin/components/provider/ProjectContext";
import "@astyle/wrapperPreviewStyle.css"
import Switch from "./Switch";
import { Project } from "@ctypes/index";
import PersonalInfo, { PersonalData } from "@ctypes/PersonalInfo";
import ProjectsSection from "@components/sections/Projects";
import CommonInfo, { CommonData } from "@ctypes/CommonInfo";
import Icon from "@inc/Icon";
import AddNewproject from "./AddNewproject";
import { useFadeInObserver } from "@inc/animated/FadeIn";
import { smoothScroll } from "@common/functions";
import { usePageSelector } from "../../provider/PageSelectorContext";

type EditProjectType = {
    projects: Project[] | null,
    commonData: CommonData | null,
}

const WrapperPreview = () => {

    const [error, setError] = useState<string | null>(null);
    // const [isInitialized, setIsInitialized] = useState(false);
    const [data, setData] = useState<EditProjectType | null>(null); 
    const { currentState } = useProjectContext();
    const { setLoader } = usePageSelector()
    const [showAdd, setShowAdd] = useState<boolean>(false)

    useFadeInObserver('.fade-in');

    const getData = async (languageSku: string) => {
        try {
            const personalInfo = new PersonalInfo(languageSku);
            const commonInfo = new CommonInfo(languageSku);
            const projects = await personalInfo.getProjects();
            const commonData = await commonInfo.getData();
            setData({ projects, commonData });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Errore sconosciuto');
        }
    }

    useEffect(() => {
        // if (isInitialized) {
        getData('it-IT');
        // }
    }, []);

    const handleUpdate = async (attribute: string, index: number) => {
        return;
    }

    const handleDelete = async (attribute: string, index: number) => {
        try {
            setLoader(true)
            await fetch('/api/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ attribute, index })
            })

            await getData('it-IT');
        } catch (err) {
            console.error(err)
        } finally {
            setLoader(false)
        }
    }

    const renderTech = (tech: string[]) => {
        if (!tech || tech.length === 0) return;

        return tech.map((e, i) => ( 
            <span key={i}>{e}{i < tech.length - 1 ? ", " : ""}</span>
        ))
    }

    const renderContentList = (projects: Project[] | null) => {
        // console.log(typeof projects, projects)
        if (!projects || projects?.length === 0) {
            return <p>Nessun progetto disponibile.</p>;
        }

        const content = projects.map((project: Project, index: number) => (
            <tr key={index + 1} className="relative table-row">
                <td>{index + 1}</td>
                <td>{project.name}</td>
                <td>{project.type}</td>
                <td className="truncate">{project.description}</td>
                <td>{renderTech(project.technologies)}</td>
                <td onClick={() => handleUpdate('projects', index)}><Icon width={25} height={25} className="pointer" useFor="modify" /></td>
                <td onClick={() => handleDelete('projects', index)}><Icon width={25} height={25} className="pointer" useFor="delete" /></td>
            </tr>
        ))

        return (
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nome progetto</th>
                        <th>Tipo</th>
                        <th>Descrizione</th>
                        <th>Linguaggi</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {content}
                </tbody>
            </table>
        )
    }

    const renderContentPreview = () => {
        return (
            <div className="preview-container">
                <ProjectsSection 
                    preview
                    data={data?.projects ?? null} 
                    commonData={data?.commonData?.projects ?? null} 
                />
            </div>
        )
    }

    const handleClose = async () => {
        await getData('it-IT');
        setShowAdd(false)
    }

    return (
        <div className="wrapper relative">
            <Switch />
            
            {currentState.type === 'preview' ?
                renderContentPreview()
            : (
                <>
                    <button 
                        className="add-new-project pointer" 
                        onClick={() => {
                            setShowAdd(prev => !prev);
                            smoothScroll("add-new-project");
                        }}
                    >
                        Add new project
                    </button>
                    {renderContentList(data?.projects ?? null)}
                    <AddNewproject id="add-new-project" onClose={handleClose} show={showAdd} data={data?.projects ?? null} />
                </>
            )}
        </div>
    );
}

export default WrapperPreview;