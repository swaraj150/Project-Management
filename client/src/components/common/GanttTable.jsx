import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { addTask, setTasks, toggleTaskModal } from "../../redux/features/taskSlice";
import { calculateIndex, deleteTask, extractDelta, formatDate, updateTaskAndFindNested } from "../../utils/task.utils";
import { addDeltaAndPublish } from "../../utils/websocket.utils";
import { removeDelta, setUpdated } from "../../redux/features/webSocketSlice";
import Task from "./Task";
import taskApi from "../../api/modules/task.api";

const GanttTable = () => {

    const tasks = useSelector((state) => state.task.tasks);
    const currentProject=useSelector((state)=>state.task.currentProject)
    const updated = useSelector((state) => state.webSocket.updated);
    const isConnected = useSelector((state) => state.webSocket.connected);
    const client = useSelector((state) => state.webSocket.client);
    const [editingCell, setEditingCell] = useState(null);
    const [updatedTasks, setUpdatedTasks] = useState(tasks);
    const [delta, setDelta] = useState(null);
    const [newTaskName, setNewTaskName] = useState("");
    const dispatch = useDispatch();
    const [isHovered, setIsHovered] = useState(null);
    const taskModal = useSelector((state) => state.task.taskModal);
    useEffect(() => {
        if (updated) {
            setUpdatedTasks(tasks);
            dispatch(setUpdated())
        }
    }, [updated, dispatch])

    const handleDelete=async(task)=>{
        if(task.id==task.index){
            dispatch(removeDelta(task.id))
            return;
        }
        // const delta={
        //     id:task.id,
        //     index:task.index,
        //     project_id:currentProject.id,
        //     publish_type:'DELETE_TASK',
        //     parentTaskId:task.parentTaskId?(task.index[0]):null
        // };
        // dispatch(addDeltaAndPublish(delta,isConnected,client));

        deleteTask(task.id,currentProject.id,dispatch)


    }

    const renderTaskRow = (task, level = 0) => {
        return (<React.Fragment key={task.id}>
            <tr>
                <td>{task.index}</td>
                <td id='table-name-row'
                    onMouseEnter={() => setIsHovered(task.index)}
                    onMouseLeave={() => setIsHovered(null)}
                >
                    {renderCell(task, "name")}
                    {isHovered != null && isHovered == task.index &&
                       <>
                       <button
                            style={{
                                backgroundColor: 'var(--white--100)',
                                color: 'black',
                                padding: '2%',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                marginRight:'2%'
                            }}
                            onClick={() => handleTaskModal(task)}>View</button>
                        <button
                            style={{
                                backgroundColor: 'var(--white--100)',
                                color: 'black',
                                padding: '2%',
                                borderRadius: '5px',
                                cursor: 'pointer',
                            }}
                            onClick={() => handleDelete(task)}>Delete</button>
                       </>
                    }
                </td>
                <td>{formatDate(task.start, true)}</td>
                <td>{formatDate(task.end, true)}</td>
                <td>{renderCell(task, "progress")}%</td>
            </tr>
            {level > 0 ? renderEmptyRow(true, level, task.index) : ""}
            {task.subtasks.map((subtask) => renderTaskRow(subtask, level + 1))}
        </React.Fragment>
        );
    }

    const handleTaskModal = (task) => {
        dispatch(toggleTaskModal({ task: task }));
    }


    const renderEmptyRow = (flag = true, level, parent) => (
        flag ? (level > 0) ? (
            <React.Fragment>
                <tr className="empty-row2">
                    <td colSpan="5"  >
                        <div style={{ display: "flex", flexDirection: "row", gap: "10px", alignItems: 'center', justifyContent: 'center' }}>
                            {renderCell(null, 'subTask', 1, 'Add new subtask for ' + parent, parent, "TASK")}

                            {renderCell(null, 'milestone', 1, 'Add new milestone', parent, "MILESTONE")}
                        </div>
                    </td>


                </tr>
            </React.Fragment>
        ) : (
            <React.Fragment>
                <tr className="empty-row2">
                    <td colSpan="5" >
                        <div style={{ display: "flex", flexDirection: "row", gap: "10px", alignItems: 'center', justifyContent: 'center' }}>
                            {renderCell(null, 'task', 0, 'Add new Task', null, "TASK")}

                            {renderCell(null, 'milestone', 1, 'Add new milestone', parent, "MILESTONE")}
                        </div>

                    </td>
                </tr>
            </React.Fragment>
        ) : (
            <React.Fragment>
                <tr className="empty-row">
                    <td colSpan="5"></td>
                </tr>
            </React.Fragment>
        )
    );


    const renderRow = (task) => (
        <React.Fragment >
            {renderTaskRow(task)}
            {renderEmptyRow(true, 1, task.index)}
        </React.Fragment>
    )


    const handleEdit = (task, field, value, parent) => {
        if (task === null) {
            setNewTaskName(value)
            return;
        }
        let newTask = {};
        let oldTask = {};
        const updatedTasksList = updatedTasks.map((task1) => {
            const { updatedTree, updatedNestedTask, oldNestedTask } = updateTaskAndFindNested(task.id, task1, field, value);

            if (updatedNestedTask) {
                newTask = updatedNestedTask;
                oldTask = oldNestedTask;
            }

            return updatedTree;
        });
        setDelta(extractDelta(oldTask, newTask))
        setUpdatedTasks(updatedTasksList);
        console.log("updatedTaskList", updatedTasksList)
        dispatch(setTasks({ tasks: updatedTasksList }));
    };
    const renderCell = (task, field, level, text, parent, type = null) => {
        const isEditing = (task === null && editingCell?.taskId === '0' && editingCell?.field === field &&
            (parent === null || (parent !== null && editingCell?.parent === parent)))
            || (editingCell?.taskId == task?.index && editingCell?.field == field);
        return isEditing ? (
            <input
                type="text"
                value={task ? task[field] : newTaskName}
                autoFocus
                onBlur={() => setEditingCell(null)}
                onChange={(e) => handleEdit(task ? task : null, field, e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        setEditingCell(null);
                        if (task === null) {
                            const { index, parentIndex } = calculateIndex(parent, updatedTasks);
                            console.log(index, parentIndex)
                            const newTask = {
                                id: index,
                                index: index,
                                taskId: index,
                                name: newTaskName,
                                start: new Date(2024, 11, 1),
                                end: new Date(2024, 11, 7),
                                subtasks: [],
                                progress: 0,
                                parentTaskId: parentIndex,// add logic in backend 
                                task_type: type
                            };
                            setNewTaskName("");
                            console.log("new Task", newTask);
                            if (parent === null) {
                                dispatch(addTask({ task: newTask }))
                                setUpdatedTasks((prevTasks) => [...prevTasks, newTask]);
                            }
                            else {
                                const newUpdatedTasks = updateTaskRecursively(tasks, parent, newTask); // Calculate the new tasks
                                setUpdatedTasks(newUpdatedTasks)
                                dispatch(setTasks({ tasks: newUpdatedTasks }))

                            }
                            addDeltaAndPublish(newTask, isConnected, client)
                            // dispatch(addDeltaAndPublish(newTask, isConnected, client)); 
                            setDelta(null);
                        }
                        else {
                            addDeltaAndPublish(delta, isConnected, client)
                            // dispatch(addDeltaAndPublish(delta, isConnected, client)); 
                            setDelta(null)

                        }

                    }
                }}
            />
        ) : (
            <span
                onClick={() => setEditingCell(task ? { taskId: task.index, field } : { taskId: '0', field, parent: parent })}

                style={{ cursor: "pointer", color: !task ? "var(--primary--600)" : "black" }}
            >
                {task ? task[field] : text}
            </span>
        );
    }
    const updateTaskRecursively = (tasks, parentIndex, newTask) => {
        return tasks.map((task) => {
            if (task.index === parentIndex) {
                return {
                    ...task,
                    subtasks: [...(task.subtasks || []), newTask],
                };
            } else if (task.subtasks && task.subtasks.length > 0) {
                return {
                    ...task,
                    subtasks: updateTaskRecursively(task.subtasks, parentIndex, newTask),
                };
            }
            return task;
        });
    };

    return (
        <div
            style={{
                overflowX: "auto",
                whiteSpace: "nowrap",
                height: "100%",
            }}
        >
            <table border="2" id="gantt-table" >
                <thead>
                    <tr>
                        <th>Sr. No</th>
                        <th>Task Name</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Progress</th>
                    </tr>
                </thead>
                <tbody>
                    {renderEmptyRow(false)}
                    {(updatedTasks && updatedTasks.length > 0) ? updatedTasks.map((task, index) => (
                        <React.Fragment key={index}>
                            {renderRow(task)}
                            {index === updatedTasks.length - 1 ? renderEmptyRow(true, 0) : ''} {/* Render the empty row */}
                        </React.Fragment>
                    )) : renderEmptyRow(true, 0)}
                </tbody>
            </table>
            {(taskModal.flag) && <Task tasks={updatedTasks} />}
        </div>
    )
}
export default GanttTable