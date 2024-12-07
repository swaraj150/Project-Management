import React, { useRef, useState } from "react";
import { Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import GanttTable from "../components/common/GanttTable";
import { useSelector } from "react-redux";

// const tasks = [
//     {
//         id: "1",
//         name: "Design Prototype",
//         start: new Date(2024, 11, 1),
//         end: new Date(2024, 11, 5),
//         progress: 60,
//     },
//     {
//         id: "2",
//         name: "Development",
//         start: new Date(2024, 11, 6),
//         end: new Date(2024, 11, 15),
//         progress: 40,
//     },
// ];

const flattenTasks = (tasks) => {
    const flatTasks = [];
    const processTask = (task, parentId = null) => {
      flatTasks.push({
        id: task.id,
        name: task.name,
        start: task.start,
        end: task.end,
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
    const tasks = useSelector((state) => state.gantt["tasks"])
    const flatTasks = flattenTasks(tasks);
    const [panelWidth, setPanelWidth] = useState(35);
    const resizerRef = useRef(null);
    const modes={
        day:ViewMode.Day,
        week:ViewMode.Week,
        month:ViewMode.Month,
        year:ViewMode.Year,
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
                <div className="table-container" style={{ width: `${panelWidth}%` }}>
                    <GanttTable />
                </div>
                <div
                    ref={resizerRef}
                    className="resizer"
                    onMouseDown={handleMouseDown}
                ></div>
                <div style={{ width: `${100-panelWidth}%`, padding: "10px" }}>
                    <Gantt tasks={flatTasks} viewMode={ViewMode.Day} listCellWidth="" />
                </div>
                


            </div>
        </section>
    );
};

export default GanttChart;
