import React, { useRef, useState } from "react";
import { Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import GanttTable from "../components/common/GanttTable";
import { useSelector } from "react-redux";

const flattenTasks = (tasks) => {
    const flatTasks = [];
    const processTask = (task, parentId = null) => {
        flatTasks.push({
            id: task.id,
            name: task.name,
            start: new Date(task.start),
            end: new Date(task.end),
            progress: task.progress,
            dependencies: parentId ? [parentId] : [],
        });

        if (task.dependencies?.length) {
            task.dependencies.forEach((subTask) => processTask(subTask, task.id));
        }
    };

    tasks.forEach((task) => processTask(task));
    return flatTasks;
};


const GanttChart = () => {
    const tasks = useSelector((state) => state.task["tasks"])
    const flatTasks = flattenTasks(tasks);
    const [panelWidth, setPanelWidth] = useState(40);
    const resizerRef = useRef(null);
    const modes = {
        day: ViewMode.Day,
        week: ViewMode.Week,
        month: ViewMode.Month,
        year: ViewMode.Year,
    }

    const handleMouseDown = (e) => {
        e.preventDefault();
        const startX = e.clientX;

        const handleMouseMove = (event) => {
            const newWidth = panelWidth + ((event.clientX - startX) / window.innerWidth) * 100;
            setPanelWidth(Math.min(95, Math.max(20, newWidth)));
        };

        const handleMouseUp = () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
    };
    return (
        <section id="gantt">
            <div className="resizable-container">

                {(flatTasks && flatTasks.length > 0) ? (
                    <>
                        <div className="table-container" style={{ width: `${panelWidth}%` }}>
                            <GanttTable />
                        </div>
                        <div
                            ref={resizerRef}
                            className="resizer"
                            onMouseDown={handleMouseDown}
                        ></div>
                        <div style={{ width: `${100 - panelWidth}%` }}>
                            <Gantt tasks={flatTasks} viewMode={ViewMode.Day} listCellWidth="" />
                        </div>
                    </>) :
                    (
                        <div className="table-container" style={{ width: '100%' }}>
                            <GanttTable />
                        </div>
                    )

                }
            </div>
        </section>
    );
};

export default GanttChart;
