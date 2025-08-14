import React from "react";
import WrapperPreview from "../edit/project/WrapperPreview";
import { ProjectProvider } from "@providers";
// import NewsWrapper from "../edit/home/NewsWrapper";

const ProjectsPage = () => {

    return (
        <ProjectProvider>
            {/* <h1>I Tuoi Progetti</h1>
            <div className="min-h-300px">
                <NewsWrapper className="center" />
            </div> */}
            <WrapperPreview />
        </ProjectProvider>
    );
}

export default ProjectsPage;