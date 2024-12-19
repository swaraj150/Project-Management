import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { addTask, incrementPointer, putId, setTasks } from "../../redux/features/taskSlice";
import { extractDelta, findByIndex } from "../../utils/task.utils";
import { addDeltaAndPublish } from "../../utils/websocket.utils";


const GanttTable = () => {
    const tasks = useSelector((state) => state.task.tasks);
    const isConnected = useSelector((state) => state.webSocket.connected);
    const client = useSelector((state) => state.webSocket.client);
    const [editingCell, setEditingCell] = useState(null);
    const [updatedTasks, setUpdatedTasks] = useState(tasks);
    const [delta, setDelta] = useState(null);
    const [newTaskName, setNewTaskName] = useState("");
    const taskPointer = useSelector((state) => state.task.taskPointer);
    const dispatch = useDispatch();

    console.log("tasks: ",updatedTasks)


    const renderTaskRow = (task, level = 0) => {
        return (<React.Fragment key={task.id}>
            <tr>
                <td>{task.index}</td>
                <td style={{ paddingLeft: `${level * 20}px` }} >{renderCell(task, "name")}</td>
                <td>{task.start.toDateString()}</td>
                <td>{task.end.toDateString()}</td>
                <td>{renderCell(task, "progress")}%</td>
            </tr>
            {level>0?renderEmptyRow(true,level,task.index):""}
            {task.dependencies.map((dependency) => renderTaskRow(dependency, level + 1))}
        </React.Fragment>
        );
    }


    const renderEmptyRow = (flag = true, level,parent) => (
        flag ? (level > 0) ? (
            <React.Fragment>
                <tr className="empty-row2">
                    <td colSpan="5" >{renderCell(null,'subTask',1,'Add new dependency for '+parent,parent)}</td>
                </tr>
            </React.Fragment>
        ) : (
            <React.Fragment>
                <tr className="empty-row2">
                    <td colSpan="5" >{renderCell(null,'task',0,'Add new Task',null)}</td>
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
            {renderEmptyRow(true, 1,task.index)}
        </React.Fragment>
    )


    const calculateIndex = (previousIndex) => {
        if (previousIndex === null) {
            const index = tasks&&tasks.length>0?tasks.length+1:1;
            return index;
        }
        let t1={};
        for(let t of updatedTasks){
            t1=findByIndex(t,previousIndex);
            if(t1!=null) break;
        }
        if(t1.dependencies.length==0){
            return previousIndex + "." + (1);
        }
        const index=t1.dependencies[t1.dependencies.length-1].index;
        const last=parseInt(index[index.length-1]);
        return index.substring(0, index.length - 1) + (last + 1);
        
    }

    const handleEdit = (taskId, field, value) => {
        if(taskId===null){
            setNewTaskName(value)
            return;
        }
        let newTask = {};
        let oldTask = {};
        const updatedTasksList = updatedTasks.map((task) => {
            const { updatedTree, updatedNestedTask, oldNestedTask } = updateTaskAndFindNested(taskId, task, field, value);

            if (updatedNestedTask) {
                newTask = updatedNestedTask;
                oldTask = oldNestedTask;
            }

            return updatedTree;
        });
        // setDeltas(extractDeltas(updatedTasks, updatedTasksList));
        setDelta(extractDelta(oldTask, newTask))
        setUpdatedTasks(updatedTasksList);
        dispatch(setTasks({ tasks: updatedTasks }));

    };
    const updateTaskAndFindNested = (id, task, field, value) => {
        let updatedNestedTask = null;
        let oldNestedTask = null

        if (id === task.id) {
            const oldTask = task;
            const updatedTask = { ...task, [field]: value };
            return { updatedTree: updatedTask, updatedNestedTask: updatedTask, oldNestedTask: oldTask };
        }

        if (task.dependencies) {
            const updatedDependencies = task.dependencies.map((subTask) => {
                const result = updateTaskAndFindNested(id, subTask, field, value);
                if (result.updatedNestedTask) {
                    updatedNestedTask = result.updatedNestedTask;
                    oldNestedTask = result.oldNestedTask;
                }
                return result.updatedTree;
            });

            return {
                updatedTree: { ...task, dependencies: updatedDependencies },
                updatedNestedTask,
                oldNestedTask
            };
        }

        return { updatedTree: task, updatedNestedTask: null, oldNestedTask: null };
    };


    // const updateTaskFields = (id, task, field, value) => {
    //     if (id === task.id) {
    //         return { ...task, [field]: value };
    //     }

    //     // if (task.dependencies) {
    //     //     const updatedDependencies = task.dependencies.map((subTask) =>
    //     //         updateTaskFields(id, subTask, field, value,newTask)
    //     //     );
    //     //     return { ...task, dependencies: updatedDependencies };
    //     // }

    //     if (task.dependencies) {
    //         for (let subTask of task.dependencies) {
    //             const updatedTask = findAndUpdateTask(id, subTask, field, value);
    //             if (updatedTask) {
    //                 // Return the updated nested dependency when found
    //                 return updatedTask;
    //             }
    //         }
    //     }

    //     return task;
    // };



   
    const renderCell = (task, field, level,text,parent) => {
        console.log("task: "+(task?.id)+" text "+(text===null?"cell":text))
        console.log(editingCell)
        const isEditing =  (task===null && editingCell?.taskId==='0' && editingCell?.field===field &&
             (parent===null || (parent!==null && editingCell?.parent===parent))) 
             || (editingCell?.taskId == task?.id && editingCell?.field == field);
        return isEditing ? (
            <input
                type="text"
                value={task?task[field]:newTaskName}
                autoFocus
                onBlur={() => setEditingCell(null)}
                onChange={(e) => handleEdit(task?task.id:null, field, e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        setEditingCell(null);
                        if(task===null){
                            const index=calculateIndex(parent);
                            const newTask={
                                id:id,
                                index:index,
                                name:newTaskName,
                                start:new Date(2024, 11, 1),
                                end:new Date(2024, 11, 7),
                                dependencies:[],
                                progress:0
                            };
                            setNewTaskName("");
                            console.log(newTask);
                            if(parent===null){
                                dispatch(addTask({task:newTask}))
                                setUpdatedTasks((prevTasks)=>[...prevTasks,newTask]);
                            }
                            else{
                                const newUpdatedTasks = updateTaskRecursively(tasks, parent, newTask); // Calculate the new tasks
                                setUpdatedTasks(newUpdatedTasks)
                                // setUpdatedTasks((prevTasks)=>updateTaskRecursively(prevTasks,parent,newTask))
                                dispatch(setTasks({tasks:newUpdatedTasks}))
                            }
                            // dispatch(putId())
                            // setDelta(newTask);
                        }
                        // dispatch(addDeltaAndPublish(delta, isConnected, client));

                        // dispatch(addDeltaAndPublish(deltas[deltas.length - 1],isConnected,client));
                        // setDeltas([])
                        setDelta(null)
                        
                    }
                }}
            />
        ) : (
            <span
                onClick={() => setEditingCell(task?{ taskId: task.id, field }:{taskId:'0',field,parent:parent})} // Enter editing mode on click
                style={{ cursor: "pointer" }}
            >
                {task?task[field]: text}
            </span>
        );
    }
    const updateTaskRecursively = (tasks, parentIndex, newTask) => {
        return tasks.map((task) => {
            if (task.index === parentIndex) {
                return {
                    ...task,
                    dependencies: [...(task.dependencies || []), newTask],
                };
            } else if (task.dependencies && task.dependencies.length > 0) {
                return {
                    ...task,
                    dependencies: updateTaskRecursively(task.dependencies, parentIndex, newTask),
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
                            {renderRow(task)} {/* Render the task row */}
                            {index === updatedTasks.length - 1 ? renderEmptyRow(true, 0) : ''} {/* Render the empty row */}
                        </React.Fragment>
                    )) : renderEmptyRow(true, 0)}
                </tbody>
            </table>
        </div>





    )
}
export default GanttTable