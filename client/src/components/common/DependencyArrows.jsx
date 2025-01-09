import React, { useRef, useEffect, useState } from "react";
import { Gantt } from "gantt-task-react";
import "gantt-task-react/dist/index.css";

const DependencyArrows = ({ tasks }) => {
    const svgRef = useRef();

    useEffect(() => {
        const svg = svgRef.current;
        if (!svg) return;

        const taskElements_rect = document.getElementsByClassName("_31ERP");
        const taskPositions = {};

        // Capture task positions
        console.log("taskElements: ", taskElements_rect)
        for (let i = 0; i < taskElements_rect.length; i++) {
            const rect = taskElements_rect[i].getBoundingClientRect();
            console.log(rect);
            taskPositions[i] = {
                xR: rect.right,
                xL: rect.left,
                y: (rect.top + rect.bottom) / 2,
            };
        }

        console.log("task positions: ", taskPositions)
        svg.innerHTML = "";
        // tasks.forEach((task, index) => {
        //     task.dependencies.forEach((dep) => {
        //         const depIndex = tasks[dep.id].index;

        //         const from = taskPositions[index];
        //         const to = taskPositions[depIndex];

        //         if (from && to) {
        //             const arrow = createArrow(from, to, dep.type);
        //             svg.appendChild(arrow);
        //         }
        //     });
        // });
    }, [tasks]);

    const createArrow = (from, to, type) => {
        const arrow = document.createElementNS("http://www.w3.org/2000/svg", "line");
        arrow.setAttribute("x1", from.xR);
        arrow.setAttribute("y1", from.y);
        arrow.setAttribute("x2", to.xL);
        arrow.setAttribute("y2", to.y);
        arrow.setAttribute("stroke", "black");
        arrow.setAttribute("stroke-width", "2");
        arrow.setAttribute("marker-end", "url(#arrowhead)");
        return arrow;
    };

    return (
        <svg ref={svgRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
            <defs>
                <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="7"
                    refX="10"
                    refY="3.5"
                    orient="auto"
                >
                    <polygon points="0 0, 10 3.5, 0 7" fill="black" />
                </marker>
            </defs>
        </svg>
    );
};

export default DependencyArrows;
