import React, { useEffect, useState, useRef } from "react"

interface LevelSelectorProps {
    currentLevel: number
    // children: React.ReactNode
    size?: number,
    strokeWidth?: number,
    timeEffect?: number
} 

export const LevelSelector = ({
    currentLevel,
    // children,
    size = 50,
    strokeWidth = 5,
    timeEffect = 2000,
}: LevelSelectorProps) => {

    // const [animatedLevel, setAnimatedLevel] = useState(0);

    // const background = `hsl(${animatedLevel * 12}, 80%, 50%)`;
    // const radius = (size - strokeWidth) / 2;
    // const circumference = 2 * Math.PI * radius;
    // const effectiveLevel = animatedLevel / 10;
    // const offset = circumference * (1 - effectiveLevel);

    // useEffect(() => {
    //     // Update the level indicator when the currentLevel changes
    //     setAnimatedLevel(currentLevel);
    // }, [currentLevel, timeEffect]);

    const [animatedLevel, setAnimatedLevel] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null); // Ref per l'ascolto

    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const effectiveLevel = animatedLevel / 10;
    const offset = circumference * (1 - effectiveLevel);
    const background = `hsl(${currentLevel * 12}, 80%, 50%)`;

    useEffect(() => {
        const node = containerRef.current;
        if (!node) return;

        // Funzione che attiva l'animazione
        const handleVisible = () => {
            setTimeout(() => {
                setAnimatedLevel(currentLevel);
            }, 100); 
        };

        // Ascoltiamo l'evento personalizzato lanciato dall'hook
        node.addEventListener('elementVisible' as any, handleVisible);

        // Se per caso la componente è già visibile (o non ha la classe fade-in)
        // facciamo un controllo di sicurezza
        if (node.classList.contains('visible')) {
            handleVisible();
        }

        return () => node.removeEventListener('elementVisible' as any, handleVisible);
    }, [currentLevel]);

    const renderLevels = () => {
        return (
            <div 
            data-tooltip={`Livello di competenza: ${currentLevel}/10`}
            ref={containerRef}
            className="fade-in" 
            style={{ 
                position: "relative", 
                width: size, 
                height: size 
            }}>
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
                        // style={{ transition: "stroke-dashoffset 0.1s linear" }}
                        style={{ 
                            transition: `stroke-dashoffset ${timeEffect}ms ease-out`,
                        }}
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
                    {animatedLevel}
                </div>
            </div>
        )
    }

    return renderLevels()
}