import React, { useEffect, useState } from "react";

type CircularLoaderProps = {
    start?: boolean
    size?: number;
    strokeWidth?: number;
    duration?: number; // in ms
    children?: React.ReactNode;
};

const CircularLoader: React.FC<CircularLoaderProps> = ({
    start = true,
    size = 100,
    strokeWidth = 10,
    duration = 5000,
    children,
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let startTime: number;
        const animate = (timestamp: number) => {
            
            if (!startTime) startTime = timestamp;

            const elapsed = timestamp - startTime;
            const percentage = Math.min(elapsed / duration, 1);
            setProgress(percentage);

            if (percentage < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    }, [duration, start]);

    const offset = circumference * (1 - progress);

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
                    stroke="#00aaff"
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
                {children}
            </div>
        </div>
    );
};

export default CircularLoader;
