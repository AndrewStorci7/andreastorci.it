import React from "react"

interface LevelSelectorProps {
    currentLevel: number
    // children: React.ReactNode
    size?: number,
    strokeWidth?: number,
} 

export const LevelSelector = ({
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