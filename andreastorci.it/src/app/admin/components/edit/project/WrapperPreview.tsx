import { useProjectContext, usePageSelector, useNotification } from "@providers";
import React, { ReactNode, useEffect, useState } from "react";
import ProjectsSection from "@components/sections/Projects";
import CommonInfo, { CommonData } from "@ctypes/CommonInfo";
import { useFadeInObserver } from "@inc/animated/FadeIn";
import { smoothScroll } from "@common/functions";
import PersonalInfo from "@ctypes/PersonalInfo";
import AddNewproject from "./AddNewproject";
import "@astyle/wrapperPreviewStyle.css";
import { Project } from "@ctypes/index";
import Switch from "./Switch";
import Icon from "@inc/Icon";

type EditProjectType = {
    projects: Project[] | null,
    commonData: CommonData | null,
}

const WrapperPreview = () => {

    const { showNotification, hideNotification } = useNotification()
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

    const handleDelete = async (attribute: string, index: number, projName: string, proceed: boolean = false) => {
        try {
            if (proceed) {
                hideNotification()
                setLoader(true)
                await fetch('/api/delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ attribute, index })
                })
    
                await getData('it-IT');
                showNotification({
                    purpose: "notification",
                    title: "Dati eliminati correttamente",
                    message: <p>Il progetto <span className="bold">{projName}</span>{"\n"} e' stato eliminato con successo!</p>,
                    type: "info",
                    customIcon: <Icon useFor="announce" width={25} height={25} />,
                    duration: 5000
                })
            } else {
                showNotification({
                    title: "Sei sicuro di voler eliminare il progetto ?",
                    message: <p>Stai per eliminare il progetto <span className="bold">{projName}</span>{"\n"}Vuoi Procedere ?</p>,
                    purpose: "alert",
                    type: "error",
                    buttons: [
                        { text: "Annulla", type: "default", onClick: () => hideNotification() },
                        { text: "Elimina", type: "cancel", onClick: () => handleDelete(attribute, index, projName, true) },
                    ]
                })
            }
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
                <td onClick={() => handleDelete('projects', index, project.name)}><Icon width={25} height={25} className="pointer" useFor="delete" /></td>
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