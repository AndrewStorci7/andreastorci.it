import React, { useEffect, useState } from "react";
import { useNotification } from "@providers";
import "@astyle/skillsStyle.css"
import Table from "../table/Table";
import { VoicesProps } from "../table/types";
import PersonalInfo from "@/types/PersonalInfo";

interface SkillData {
    name: string
    level: number
    category: string
} 

interface LevelSelectorProps {
    currentLevel: number
    // children: React.ReactNode
    size?: number,
    strokeWidth?: number,
} 

const LevelSelector = ({
    currentLevel,
    // children,
    size = 50,
    strokeWidth = 5,
}: LevelSelectorProps) => {

    const background = `hsl(${currentLevel * 12}, 80%, 50%)`;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const effectiveLevel = currentLevel / 10;
    const offset = circumference * (1 - effectiveLevel);

    const renderLevels = () => {
        return (
            <div style={{ position: "relative", width: size, height: size }}>
                <svg width={size} height={size}>

                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="#ddd"
                        strokeWidth={strokeWidth}
                        fill="none"
                    />

                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={background}
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        style={{ transition: "stroke-dashoffset 0.1s linear" }}
                        transform={`rotate(-90 ${size / 2} ${size / 2})`}
                    />
                </svg>

                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: size,
                        height: size,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {currentLevel}
                </div>
            </div>
        )
    }

    return renderLevels()
}

const SkillsPage = () => {

    const { showNotification, hideNotification } = useNotification();
    const [contents, setContents] = useState<any[]>([]); 
    const voices: VoicesProps[] = [
        { name: "Nome", width: 4 },
        { name: "Categorie", width: 4 },
        { name: "Livello", width: 2 }
    ];

    useEffect(() => {
        const fetchData = async () => {
            const PersonalData = new PersonalInfo('it-IT')
            const skillsData = await PersonalData.getSkills();
            if (!skillsData) {
                showNotification({
                    purpose: 'alert',
                    title: "Errore durante il caricamento dei dati",
                    message: "Dati non trovati per skills",
                    type: 'error',
                    buttons: [{ text: "Annulla", type: "default", onClick: () => hideNotification() }]
                })
                return;
            } 
            
            // Prendo solo i valori per poterli stampare correttamente all'interno di <Table>
            // dopodiché prendo swappo l'ultimo elemento con il penultimo (solamente per questione estestiche)
            const newContents = skillsData.map((skill: SkillData) => Object.values(skill));
            newContents.map((e) => {
                let backup = e;
                const tmp = backup[1];
                backup[1] = backup[2];
                backup[2] = tmp;
                backup[2] = <LevelSelector currentLevel={backup[2]} />
                return backup
            })
            setContents(newContents);
        }
        fetchData();
    }, [])

    return (
        <div className="skills-section-admin">
            <Table voices={voices} contents={contents} />
        </div>
    );
}

export default SkillsPage;