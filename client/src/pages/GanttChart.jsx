import React, { useEffect, useRef, useState } from "react";
import GanttTable from "../components/common/GanttTable";
import { useDispatch, useSelector } from "react-redux";
import GanttChartDhtmlx from "../components/common/GanttChartDhtmlx";
import { dependency_types, dependency_types_for_server, extractDelta, formatDate } from "../utils/task.utils";
import { addDeltaAndPublish } from "../utils/websocket.utils";

const flattenTasks = (tasks) => {
    const taskList = { data: [], links: [] };
    const flatTaskMap = {};
    const taskIndexRef = { i: 0 };
    const linkIndexRef = { i: 0 };
    const processTask = (task, taskIndexRef,linkIndexRef, parentId = null) => {
        const task1 = {
            id: task.id,
            text: task.name,
            start_date: new Date(task.start),
            end_date: new Date(task.end),
            progress: task.progress / 100,
            parent: parentId || null,
            type: (task.task_type == null ? "task" : task.task_type).toLowerCase(),

        };
        // const blankTask={
        //     id: (++indexRef.i)+100,
        //     text: "",
        //     // start_date: null,
        //     duration: 0, 
        //     progress: 0,
        //     parent: 0,
        // };
        
        taskList.data.push(task1); 
        // taskList.data.push(blankTask); 
        flatTaskMap[task.id] = { ...task1, index: task.index,taskIndex:taskIndexRef.i++,status:task.status }
        const links = task.dependencies?.map((d) => {
            const link = {
                id: linkIndexRef.i++,
                source: d.fromTaskId,
                target: d.toTaskId,
                type: dependency_types[d.dependencyType]
            }
            flatTaskMap[link.id] = link;
            return link
        })
        taskList.links.push(...links || []);
        if (task.subtasks?.length) {
            task.subtasks.forEach((subTask) => processTask(subTask, taskIndexRef,linkIndexRef, task.id));
        }
    };

    tasks.forEach((task) => processTask(task, taskIndexRef,linkIndexRef));
    return { taskList, flatTaskMap };
};


const GanttChart = () => {
    const tasks = useSelector((state) => state.task["tasks"])
    const taskMap = useSelector((state) => state.task["taskMap"])
    const client=useSelector((state)=>state.webSocket.client);
    const isConnected=useSelector((state)=>state.webSocket.connected);
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
    const [flatTaskMap, setFlatTaskMap] = useState({})
    const dispatch=useDispatch();
    useEffect(() => {
        const { taskList, flatTaskMap } = flattenTasks(tasks);
        // console.dir("flat tasks",flatTasks.data);
        setFlatTasks(taskList);
        setFlatTaskMap(flatTaskMap)

    }, [tasks])
    const convertToReduxState = (task) => {
        return {
            id: task.id,
            index: task.index,
            name: task.text || null,
            start: task.start_date?.toISOString(),
            end: task.end_date?.toISOString(),
            parentTaskId: taskMap[parent] || null,
            progress: task.progress * 100 || null,
        }
    }
    const handleTaskUpdate = (id, updatedTask) => {
        const oldTask = flatTaskMap[id];       
        let delta = extractDelta(oldTask, updatedTask);
        delta = { ...delta, index: oldTask.index };
        delta=convertToReduxState(delta);
        console.log(delta)
        dispatch(addDeltaAndPublish(delta, isConnected, client));
        
    };
    const validateLink=(link)=>{
        const source=flatTaskMap[link.source];
        const target=flatTaskMap[link.target];
        if(source.taskIndex>target.taskIndex){
            return false;
        }
        switch(link.type){
            case dependency_types.FINISH_TO_START:{
                if((source.status=="PENDING" || source.status=="IN_PROGRESS") && target.status!="PENDING"){
                    return false;
                }
                break;
            }
            case dependency_types.FINISH_TO_FINISH : {
                if((source.status=="PENDING" || source.status=="IN_PROGRESS") && target.status!="COMPLETED"){
                    return false;
                }
                break;
            }
            case dependency_types.START_TO_FINISH : {
                
                if(source.status=="PENDING" && target.status!="COMPLETED"){
                    return false;
                }
                break;
            }
            case dependency_types.START_TO_START : {
                if(source.status=="PENDING" && target.status!="PENDING"){
                    return false;
                }
                break;
            }
        }
        return true;
    }
    const handleAddLink = (link) => {
        console.log(link);
        const lastLinkId = flatTasks.links.length === 0 ? 0 : flatTasks.links[flatTasks.links.length - 1].id;
        const links = [...flatTasks.links, { id: lastLinkId + 1, ...link }];
        setFlatTasks({ ...flatTasks, links }); 
        const delta={
            id:link.source,
            index:flatTaskMap[link.source].index,
            to_task_id:link.target,
            dependency_type:dependency_types_for_server[link.type]
        }
        dispatch(addDeltaAndPublish(delta,isConnected,client));
        
    };
    

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
                {(flatTasks && flatTasks.data?.length >= 0) ? (
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
                            <GanttChartDhtmlx tasks={flatTasks} onTaskUpdated={handleTaskUpdate} validateLink={validateLink} handleAddLink={handleAddLink} />
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
