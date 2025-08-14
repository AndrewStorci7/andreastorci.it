/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNotification, usePageSelector } from '@providers';
import React, { useState, useEffect, ReactNode } from 'react';
import MultipleSelect from '@common/MultipleSelect';
import { Project } from '@ctypes/index';
import "@astyle/addnewprojectStyle.css";

interface AddNewProjectProps {
    id: string
    show?: boolean,
    data: Project[] | null,
    onClose?: (e?: any) => void
}

const AddNewproject = ({
    id,
    show,
    data,
    onClose
}: AddNewProjectProps) => {

    const { showNotification } = useNotification()
    const { setLoader } = usePageSelector();
    // const [newData, setNewData] = useState<PersonalData | null>();
    const [existingData, setData] = useState<Project[] | null>(data)
    const [newProject, setNewProject] = useState<Project | null>({
        name: '',
        type: '',
        role: [],
        description: '',
        technologies: [],
        link: '',
        image: '',
        sku: '',
    });

    useEffect(() => {
        if (data) {
            setData(data)
        }
    }, [data])

    // console.log(newProject)

    const handleNotification = (message: string | ReactNode) => {
        showNotification({
            purpose: "notification",
            title: "Errore durante l&apos;aggiunta",
            message: message,
            type: "error"
        })
    }

    const handleUpdate = (attr: string, newVal: any) => {
        setNewProject(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                [attr]: newVal
            };
        });
    }

    const handleCancel = () => {
        onClose?.()
        setNewProject({
            name: '',
            type: '',
            role: [],
            description: '',
            technologies: [],
            link: '',
            image: '',
            sku: '',
        })
    }

    const handleSave = async () => {
        try {
            if (newProject && existingData) {
                setLoader(true)
                // const updatedData = {
                //     ...existingData,
                //     projects: [...existingData.projects, newProject]
                // };

                // setData(updatedData);
                // const lastProjectAdded = updatedData?.projects[updatedData?.projects.length - 1]; 
                // console.log(lastProjectAdded)

                const reqTransEn = await fetch('/api/translate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        data: newProject,
                        lang: 'en'
                    })
                })
                const reqTransEs = await fetch('/api/translate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        data: newProject,
                        lang: 'es'
                    })
                })

                const resEn = await reqTransEn.json()
                const resEs = await reqTransEs.json()

                const req = await fetch('/api/update', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        dataIt: newProject,
                        dataEs: resEs.translation,
                        dataEn: resEn.translation,
                        updateProp: 'projects'
                    })
                });
                const res = await req.json()

                if (!res?.success) {
                    // throw new Error("Errore nell'aggiornamento dei dati")
                    handleNotification(<p>Si è presentato un errore durante l&apos;aggiutna di un nuovo progetto <b>(errore 100)</b></p>)
                } else {
                    onClose?.()
                }
            } else {
                // throw new Error("Dati non validi")
                handleNotification(<p>I dati inseriti per l&apos;aggiunta non sono validi <b>(errore 100)</b></p>)
            }
        } catch (err) {
            // console.error(err)
            handleNotification(<p>Server traduzione non raggiungibile: {String(err)} <b>(errore 500)</b></p>)
        } finally {
            setLoader(false)
        }
    }

    return (
        <div id={id} className={show ? "visible" : "hidden"}>
            <div className='add-new-project-container'>
                <div className='header'>
                    <h3>Aggiungi un nuovo progetto</h3>
                </div>
                <div className=''>
                    <form className='w-100 grid grid-col-max'>
                        <div className='flex column input-form'>
                            <label htmlFor='project-name'>Nome del progetto</label>
                            <input id="project-name" onChange={(e) => handleUpdate('name', e.target.value)} type='text' placeholder='Salamaleku' />
                        </div>
                        <div className='flex column input-form'>
                            <label htmlFor='project-desc'>Descrizione</label>
                            <textarea onChange={(e) => handleUpdate('description', e.target.value)} id="project-desc" placeholder='Salamaleku plus' />
                        </div>
                        <div className='flex column input-form'>
                            <label htmlFor='project-type'>Tipo</label>
                            <select id="project-type" onChange={(e) => handleUpdate('type', e.target.value)}>
                                <option value={"Web App"}>Web App</option>
                                <option value={"App Desktop"}>App Desktop</option>
                                <option value={"Sito Web"}>Sito Web</option>
                                <option value={"App Mobile"}>App Mobile</option>
                                <option value={"Software"}>Software</option>
                            </select>
                        </div>
                        <div className='flex column input-form'>
                            <label htmlFor='project-role'>Ruolo</label>
                            <input id="project-role" onChange={(e) => handleUpdate('role', e.target.value)} placeholder='Salamalaka kaka kaka'/>
                        </div>
                        <div className='flex column input-form'>
                            <label htmlFor='multselect-tech'>Link</label>
                            <input id="multselect-tech" onChange={(e) => handleUpdate('link', e.target.value)} placeholder='Salamalaka' />
                        </div>
                        <div className='flex column input-form'>
                            <label htmlFor='multselect-tech'>Linguaggi/Framework/Librerie</label>
                            {/* <MultipleSelect id="multselect-tech" onChange={(e: Set<string>) => handleUpdate('technologies', e)} /> */}
                            <MultipleSelect id="multselect-tech" onChange={(e: string[]) => handleUpdate('technologies', e)} />
                        </div>
                    </form>
                </div>
                <div className='buttons-container grid grid-col-2'>
                    <div className=''>
                        <button className='w-100 btn-save' onClick={handleSave}>Salva</button>
                    </div>
                    <div className=''>
                        <button className='w-100 btn-cancel' onClick={handleCancel}>Cancella</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddNewproject;