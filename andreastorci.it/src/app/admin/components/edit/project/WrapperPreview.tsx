import { usePageSelector, useNotification } from "@providers";
// import ProjectsSection from "@components/sections/Projects";
import { useFadeInObserver } from "@inc/animated/FadeIn";
import React, { useEffect, useState } from "react";
import { smoothScroll } from "@common/functions";
import PersonalInfo from "@ctypes/PersonalInfo";
import { CommonData } from "@ctypes/CommonInfo";
import AddNewproject from "./AddNewproject";
import "@astyle/wrapperPreviewStyle.css";
import { Project } from "@ctypes";
// import Switch from "./Switch";
import Icon from "@inc/Icon";
import Table from "../../table/Table";
import { VoicesProps } from "../../table/types";
import { TableProvider } from "../../table/provider/TableContext";

type EditProjectType = {
    projects: Project[] | null,
    commonData: CommonData | null,
}

const WrapperPreview = () => {

    const { showNotification, hideNotification } = useNotification()
    const [, setError] = useState<string | null>(null);
    // const [isInitialized, setIsInitialized] = useState(false);
    // const [data, setData] = useState<EditProjectType | null>(null); 
    // const { currentState } = useProjectContext();
    const { setLoader } = usePageSelector()
    // const [showAdd, setShowAdd] = useState<boolean>(false);
    const voices: VoicesProps[] = [
        { name: "Nome", width: 2 }, 
        { name: "Tipo", width: 1 }, 
        { name: "Descrizione", width: 4 }, 
        { name: "Linguaggi", width: 3 }
    ]
    const [contents, setContents] = useState<any[]>([]);

    useFadeInObserver('.fade-in');

    const getData = async (languageSku: string) => {
        try {
            const personalInfo = new PersonalInfo(languageSku);
            const projects = await personalInfo.getProjects();
            // const commonData = await personalInfo.getCommonInfos();
            
            const newContents = projects.map((project) => Object.values(project).slice(0, 4))
            newContents.map((project, i) => {
                const values = Object.values(project);
                const firstThree = values.slice(0, 3);
                const fourthElement = values[3]; 
                return [...firstThree, fourthElement];
            });

            console.log(newContents)
            
            setContents(newContents);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Errore sconosciuto');
        }
    }

    useEffect(() => {
        // if (isInitialized) {
        getData('it-IT');
        // }
    }, []);

    // const handleUpdate = async (attribute?: string, index?: number) => {
    //     console.log("Update", attribute, index);
    //     return;
    // }

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
                    message: <p>Il progetto <span className="bold">{projName}</span>{"\n"} è stato eliminato con successo!</p>,
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

    // const handleClose = async () => {
    //     await getData('it-IT');
    //     setShowAdd(false)
    // }

    return (
        <TableProvider
        settings={voices}
        // apiEndpoint="/api/data/addProject"
        handleCancel={() => {}}
        handleSave={() => {}}
        data={{ 
            dataKeys: ["name", ""],
            dataValues: []
        }}
        >
            <div className="wrapper relative">
                <Table contents={contents} />
            </div>
        </TableProvider>
    );
}

export default WrapperPreview;