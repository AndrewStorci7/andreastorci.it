import React from "react";
import WrapperPreview from "../edit/project/WrapperPreview";
import { ProjectProvider } from "@/admin/components/provider/ProjectContext";

const ProjectsPage = () => {

    return (
        <ProjectProvider>
            <h1>I Tuoi Progetti</h1>
            <WrapperPreview />
        </ProjectProvider>
    );
}

export default ProjectsPage;