import { TableProvider } from "@components/table/provider/TableContext";
import { useFadeInObserver } from "@inc/animated/FadeIn";
import { VoicesProps } from "@components/table/types";
import PersonalInfo from "@ctypes/PersonalInfo";
import { useNotification } from "../provider";
import Table from "@components/table/Table";
import "@astyle/wrapperPreviewStyle.css";
import { Project } from "@ctypes";
import React from "react";

const ProjectsPage = () => {

    const PersonalData = new PersonalInfo("it-IT");
    const { showNotification } = useNotification();
    const voices: VoicesProps[] = [
        { name: "Nome", width: 2 }, 
        { name: "Tipo", width: 1 }, 
        { name: "Descrizione", width: 3 }, 
        { name: "Linguaggi", width: 1, contentIsArray: true, infoContent: "Ogni valore deve essere diviso da una virgola" },
        { name: "Link", width: 1, show: false },
        { name: "Ruoli", width: 1, show: false, contentIsArray: true, infoContent: "Ogni valore deve essere diviso da una virgola" },
        { name: "Immagine", width: 1, show: false, typeContent: "image" },
        { name: "Sku", width: 1, show: false },
    ]

    useFadeInObserver('.fade-in');

    const handleSave = async (newData: Project) => {

        const test = await PersonalData.addOneProject(newData);
        
        showNotification({
            purpose: "notification",
            title: (test.success) ? 
                "" : 
                "Errore nell'inserimento di un nuovo dato",
            message: (test.success) ? 
                "Inserimento avvenuto con successo!" : 
                "Non è stato possibile aggiugnere un nuovo dato per la tabella `projects`, controlla che i dati siano corretti e che non abbiano caratteri speciali non accettati",
            duration: (test.success) ? 4000 : 6000,
            type: (test.success) ? "completed" : "error"
        })

        if (!test.success) {
            throw test.error
        }
    }

    return (
        <TableProvider
        settings={voices}
        attribute="projects"
        handleCancel={() => {}}
        handleSave={(e) => handleSave(e as Project)}
        data={{ 
            dataKeys: ["name", "type", "description", "technologies", "link", "role", "image", "sku"],
            dataValues: []
        }}
        >
            <div className="wrapper relative">
                <Table />
            </div>
        </TableProvider>
    );
}

export default ProjectsPage;