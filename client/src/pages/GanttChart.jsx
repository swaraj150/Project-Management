import React, { useEffect, useRef, useState } from "react";
import GanttTable from "../components/common/GanttTable";
import { useSelector } from "react-redux";
import GanttChartDhtmlx from "../components/common/GanttChartDhtmlx";
import { dependency_types, formatDate } from "../utils/task.utils";

const flattenTasks = (tasks) => {
    const taskList = {data:[],links:[]};
    const indexRef = { i: 0 };
    const day=(1000*60*60*24);
    const processTask = (task,indexRef,parentId=null) => {
        taskList.data.push({
            id: task.id,
            // index:indexRef.i++,
            text: task.name,
            // start_date: formatDate(task.start,true),
            start_date:new Date(task.start),
            end_date:new Date(task.end),
            // duration: (new Date(task.end)-new Date(task.start))/day,
            progress: task.progress/100,
            parent:parentId||null,
            type: (task.task_type == null ? "task" : task.task_type).toLowerCase(),

        });
        const links=task.dependencies?.map((d)=>{
            return {
                id:indexRef.i++,
                source:task.id,
                target:d.id,
                type:dependency_types[d.type]
            }
        })
        taskList.links.push(...links);

        if (task.subtasks?.length) {
            task.subtasks.forEach((subTask) => processTask(subTask,indexRef,task.id));
        }
    };

    tasks.forEach((task) => processTask(task,indexRef));
    return taskList;
};


const GanttChart = () => {
    const tasks = useSelector((state) => state.task["tasks"])
    // const data = {
    //     data: [
    //         { id: 1, text: "Project #1", start_date: null, duration: null, parent: 0, progress: 0, open: true },
    //         { id: 2, text: "Task #1", start_date: "2019-08-01 00:00", duration: 5, parent: 1, progress: 1 },
    //         { id: 3, text: "Task #2", start_date: "2019-08-06 00:00", duration: 2, parent: 1, progress: 0.5 },
    //         { id: 4, text: "Task #3", start_date: null, duration: null, parent: 1, progress: 0.8, open: true },
    //         { id: 5, text: "Task #3.1", start_date: "2019-08-09 00:00", duration: 2, parent: 4, progress: 0.2 },
    //         { id: 6, text: "Task #3.2", start_date: "2019-08-11 00:00", duration: 1, parent: 4, progress: 0 }
    //     ],
    //     links: [
    //         { id: 1, source: 2, target: 3, type: "0" },
    //         { id: 2, source: 3, target: 4, type: "0" },
    //         { id: 3, source: 5, target: 6, type: "0" }
    //     ]
    // }
    const [flatTasks, setFlatTasks] = useState({});
    const handleTaskUpdate = (id, updatedTask) => {
        console.log("Task updated:", id, updatedTask);
        // Update tasks if needed
    };

    useEffect(()=>{
        const flatTasks=flattenTasks(tasks);
        console.dir("flat tasks",flatTasks);
        setFlatTasks(flatTasks);
    },[tasks])

    const [panelWidth, setPanelWidth] = useState(40);
    const resizerRef = useRef(null);

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
            <div className="resizable-container" style={{ display: "flex", height: "100%", width: "100%" }}>
                {(flatTasks && flatTasks.data?.length > 0) ? (
                    <>
                        <div
                            className="table-container"
                            style={{ width: `${panelWidth}%`, flexShrink: 0 }}
                        >
                            <GanttTable />
                        </div>
                        <div
                            ref={resizerRef}
                            className="resizer"
                            onMouseDown={handleMouseDown}
                        ></div>
                        <div style={{ flexGrow: 1, overflowY: "scroll", width: `${100 - panelWidth}%` }}>
                            <GanttChartDhtmlx tasks={flatTasks} onTaskUpdated={handleTaskUpdate} />
                        </div>
                    </>
                ) : (
                    <div className="table-container" style={{ width: "100%" }}>
                        <GanttTable />
                    </div>
                )}
            </div>
        </section>

    );
};

export default GanttChart;
