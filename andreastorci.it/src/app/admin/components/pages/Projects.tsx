import { TableProvider } from "@components/table/provider/TableContext";
import { useFadeInObserver } from "@inc/animated/FadeIn";
import { VoicesProps } from "@components/table/types";
import Table from "@components/table/Table";
import "@astyle/wrapperPreviewStyle.css";
import React from "react";


// type EditProjectType = {
//     projects: Project[] | null,
//     commonData: CommonData | null,
// }

const ProjectsPage = () => {

    const voices: VoicesProps[] = [
        { name: "Nome", width: 2 }, 
        { name: "Tipo", width: 1 }, 
        { name: "Descrizione", width: 4 }, 
        { name: "Linguaggi", width: 3 }
    ]

    useFadeInObserver('.fade-in');

    return (
        <TableProvider
        settings={voices}
        attribute="projects"
        handleCancel={() => {}}
        handleSave={() => {}}
        data={{ 
            dataKeys: ["name", ""],
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