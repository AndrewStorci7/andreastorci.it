import React from "react";
import { useNotification } from "@providers";
import "@astyle/skillsStyle.css"
import Table from "../table/Table";
import { VoicesProps } from "../table/types";
import PersonalInfo from "@ctypes/PersonalInfo";
import { Skill } from "@ctypes";
import { TableProvider } from "../table/provider/TableContext";

const SkillsPage = () => {

    const PersonalData = new PersonalInfo('it-IT');
    const { showNotification } = useNotification();
    const voices: VoicesProps[] = [
        { name: "Nome", width: 4 },
        { name: "Livello", width: 2 },
        { name: "Categorie", width: 4 },
    ];

    const handlerForSave = async (newData: Skill) => {
        const test = await PersonalData.addOneSkill(newData);
        
        showNotification({
            purpose: "notification",
            title: (test.success) ? 
                "" : 
                "Errore nell'inserimento di un nuovo dato",
            message: (test.success) ? 
                "Inserimento avvenuto con successo!" : 
                "Non è stato possibile aggiugnere un nuovo dato per la tabella `skills`, controlla che i dati siano corretti e che non abbiano caratteri speciali non accettati",
            duration: (test.success) ? 4000 : 6000,
            type: (test.success) ? "completed" : "error"
        })
    }

    const handlerForCancel = () => {}

    return (
        <TableProvider
        settings={voices}
        attribute="skills"
        handleCancel={handlerForCancel}
        handleSave={(e) => handlerForSave(e as Skill)}
        data={{
            dataKeys: ["name", "level", "category"],
            dataValues: []
        }}
        >
            <div className="skills-section-admin">
                <Table />
            </div>
        </TableProvider>
    );
}

export default SkillsPage;