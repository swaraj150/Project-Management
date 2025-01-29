import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addDeltaAndPublish } from "../../utils/websocket.utils";
import { setTasks } from "../../redux/features/taskSlice";
import { createTaskList, updateDependenciesDates } from "../../utils/task.utils";
import { setUpdated } from "../../redux/features/webSocketSlice";

const DependencyList = ({ onClose, currentTask, taskList }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const tasksState = useSelector((state) => state.task.tasks);
    const [dependency, setDependency] = useState(null);

    // const tasks = [
    //     { id: '1',index:"1", name: 'Task 1' },
    //     { id: '2',index:"2", name: 'Task 2' },
    //     { id: '3',index:"3", name: 'Task 3' },
    // ];
    const dispatch = useDispatch();
    const client = useSelector((state) => state.webSocket.client);
    const isConnected = useSelector((state) => state.webSocket.connected);
    const filteredTasks = taskList.filter((task) =>
        task.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const addDependency = (toTask) => {
        const delta = {
            id: currentTask.id,
            index: currentTask.index,
            to_task_id: toTask.id,
            dependency_type: dependency.type,
            lag: !dependency.lag ? 0 : dependency.lag
        };

        console.log(dependency)
        const lag = parseInt(delta.lag);
        const toTaskStart = new Date(toTask.start);
        const toTaskEnd = new Date(toTask.end);
        const currentTaskStart = new Date(currentTask.start);
        const currentTaskEnd = new Date(currentTask.end);
        const toTaskDuration = toTaskEnd - toTaskStart;
        const day = 1000 * 60 * 60 * 24;
        switch (dependency.type) {
           
            case 'FINISH_TO_FINISH': {
                delta.start = new Date(currentTaskEnd.getTime() - toTaskDuration - (lag + 1) * day).toISOString();
                delta.end = new Date(currentTaskEnd.getTime() + (lag) * day).toISOString();
                break;
            }
            case 'FINISH_TO_START': {
                delta.start = new Date(currentTaskEnd.getTime() + (lag) * day).toISOString();
                delta.end = new Date(currentTaskEnd.getTime() + toTaskDuration + (lag + 1) * day).toISOString();
                break;
            }
            case 'START_TO_START': {
                delta.start = new Date(currentTaskStart.getTime() + (lag) * day).toISOString();
                delta.end = new Date(currentTaskStart.getTime() + toTaskDuration + (lag + 1) * day).toISOString();
                break;
            }
            case 'START_TO_FINISH': {
                delta.start = new Date(currentTaskStart.getTime() - toTaskDuration - (lag + 1) * day).toISOString();
                delta.end = new Date(currentTaskStart.getTime() + (lag) * day).toISOString();
                break;
            }
            default:
                break;
        }

        toTask = {
            ...toTask,
            start: delta.start,
            end: delta.end
        };
        console.log(delta);
        const updatedTasks = addDependencyGlobally(currentTask,toTask, dependency.type, tasksState, lag);
        const dependencies_delta=[]
        dependencies_delta.push(delta)
        updateDependenciesDates(updatedTasks,toTask.id,toTask.start,toTask.end,dependencies_delta)
        dispatch(setTasks({ tasks: updatedTasks }));
        dispatch(setUpdated())
        for(const delta1 in dependencies_delta){
            dispatch(addDeltaAndPublish(delta1,isConnected,client))
        }
        setDependency(null);
        onClose();

        // addDeltaAndPublish(delta,isConnected,client);
    }
    const addDependencyGlobally = (fromTask,toTask, type, tasks1, lag) => {
        return tasks1.map((task) => {

            if (task.index === fromTask.index) {
                return {
                    ...task,
                    dependencies: [...(task.dependencies || []), { id: toTask.id, index: toTask.index, type: type, lag: lag,start:toTask.start,end:toTask.end }],
                    subtasks: task.subtasks ? addDependencyGlobally(fromTask,toTask, type, task.subtasks, lag) : task.subtasks,
                };
            }
            if (task.index === toTask.index) {
                const updatedTask= { ...task, start: toTask.start, end: toTask.end };// change in its dependencies might need
                
                
                return updatedTask;
            }
            if (task.subtasks && task.subtasks.length > 0) {
                return {
                    ...task,
                    subtasks: addDependencyGlobally(fromTask,toTask, type, task.subtasks, lag),
                };
            }
            return task;
        });
    };



    return (
        <div
            style={{
                position: 'fixed',
                width: "50%",
                height: "50vh",
                boxShadow: "-2px 0 10px rgba(0, 0, 0, 0.3)",
                padding: "20px",
                overflowY: "auto",
                backgroundColor: "#fff",
                borderRadius: "8px",
                zIndex: '1000',
                transition: 'right 0.3s ease',
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                }}
            >
                <h1 style={{ fontSize: "18px", margin: 0, color: "#333" }}>Add Dependency</h1>
                <button
                    className="close-button"
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'none',
                        border: 'none',
                        fontSize: '20px',
                        cursor: 'pointer',
                    }}
                    onClick={onClose}
                    aria-label="Close"
                >
                    ✖
                </button>
            </div>

            {/* Search Bar */}
            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Search for tasks"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "10px",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        fontSize: "14px",
                        backgroundColor: "#fff",
                    }}
                />
            </div>

            {/* Task List */}
            <div>
                {filteredTasks.length > 0 ? (
                    filteredTasks.map((task) => (
                        <div
                            key={task.id}
                            style={{
                                marginBottom: "15px",
                                backgroundColor: "#fff",
                                padding: "15px",
                                borderRadius: "8px",
                                boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
                                display: 'flex',
                                flexDirection: 'column',
                                gap: "10px",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: "16px",
                                        fontWeight: "500",
                                        color: "#333",
                                    }}
                                >
                                    {task.index}
                                </span>
                                <span
                                    style={{
                                        fontSize: "16px",
                                        fontWeight: "500",
                                        color: "#333",
                                    }}
                                >
                                    {task.name}
                                </span>
                                <div style={{ display: "flex", gap: "10px" }}>
                                    <button onClick={() => setDependency({ ...dependency, type: "FINISH_TO_FINISH" })} style={{ ...buttonStyle, backgroundColor: "#e0f7fa" }}>Finish-To-Finish</button>
                                    <button onClick={() => setDependency({ ...dependency, type: "START_TO_FINISH" })} style={{ ...buttonStyle, backgroundColor: "#e3f2fd" }}>Start-To-Finish</button>
                                    <button onClick={() => setDependency({ ...dependency, type: "FINISH_TO_START" })} style={{ ...buttonStyle, backgroundColor: "#e8f5e9" }}>Finish-To-Start</button>
                                    <button onClick={() => setDependency({ ...dependency, type: "START_TO_START" })} style={{ ...buttonStyle, backgroundColor: "#fff3e0" }}>Start-To-Start</button>

                                    <label
                                        htmlFor={`lag-${task.id}`}
                                        style={{
                                            fontSize: "14px",
                                            color: "#555",
                                            fontWeight: "500",
                                        }}
                                    >
                                        Lag:
                                    </label>
                                    <input
                                        id={`lag-${task.id}`}
                                        type="number"
                                        min="0"
                                        onBlur={(e) => setDependency({ ...dependency, lag: e.target.value })}
                                        onChange={(e) => setDependency({ ...dependency, lag: e.target.value })}
                                        style={{
                                            width: "80px",
                                            padding: "8px",
                                            border: "1px solid #ddd",
                                            borderRadius: "6px",
                                            fontSize: "14px",
                                            backgroundColor: "#fff",
                                        }}
                                    />
                                    <button onClick={() => addDependency(task)} style={{ ...buttonStyle, backgroundColor: "var(--primary--200)" }}>Save</button>
                                </div>
                            </div>
                            {/* <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                }}
                            >
                                
                            </div> */}
                        </div>
                    ))
                ) : (
                    <p style={{ textAlign: 'center', color: '#888' }}>No tasks found</p>
                )}
            </div>
        </div>
    );
};

const buttonStyle = {
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "bold",
    color: "#333",
    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
    transition: "background-color 0.3s ease, transform 0.2s ease",
};

buttonStyle[":hover"] = {
    transform: "scale(1.05)",
    backgroundColor: "#f0f0f0",
};

export default DependencyList;
