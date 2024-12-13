import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { setTasks } from "../../redux/features/ganttSlice";
import { addDelta } from "../../redux/features/webSocketSlice";
import { extractDelta } from "../../utils/task.utils";
import { addDeltaAndPublish, publishTasks } from "../../utils/websocket.utils";


const GanttTable = () => {
    const tasks = useSelector((state) => state.gantt["tasks"]);
    const isConnected = useSelector((state) => state.webSocket.connected);
    const client = useSelector((state) => state.webSocket.client);
    const [editingCell, setEditingCell] = useState(null);
    const [updatedTasks, setUpdatedTasks] = useState(tasks);
    const [delta, setDelta] = useState(null);
    // const [deltas, setDeltas] = useState([]);
    const dispatch = useDispatch();
    const renderTaskRow = (task, level = 0) => {
        return (<React.Fragment key={task.id}>
            <tr>
                <td>{task.index}</td>
                <td style={{ paddingLeft: `${level * 20}px` }} >{renderCell(task, "name")}</td>
                <td>{task.start.toDateString()}</td>
                <td>{task.end.toDateString()}</td>
                <td>{renderCell(task, "progress")}%</td>
            </tr>
            {task.dependencies.map((dependency) => renderTaskRow(dependency, level + 1))}

        </React.Fragment>

        );
    }
    const renderEmptyRow = () => (
        <React.Fragment>
            <tr className="empty-row">
                <td colSpan="4"></td>
            </tr>
        </React.Fragment>

    );

    const renderRow = (task) => (

        <React.Fragment >
            {renderTaskRow(task)}
            {renderEmptyRow()}
        </React.Fragment>
    )

    const handleEdit = (taskId, field, value) => {

        let newTask = {};
        let oldTask = {};
        const updatedTasksList = updatedTasks.map((task) => {
            const { updatedTree, updatedNestedTask,oldNestedTask } = updateTaskAndFindNested(taskId, task, field, value);

            // Update `newTask` only when a nested task is found
            if (updatedNestedTask) {
                newTask = updatedNestedTask;
                oldTask=oldNestedTask;
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
        let oldNestedTask=null

        if (id === task.id) {
            const oldTask=task;
            const updatedTask = { ...task, [field]: value };
            return { updatedTree: updatedTask, updatedNestedTask: updatedTask, oldNestedTask:oldTask };
        }

        if (task.dependencies) {
            const updatedDependencies = task.dependencies.map((subTask) => {
                const result = updateTaskAndFindNested(id, subTask, field, value);
                if (result.updatedNestedTask) {
                    updatedNestedTask = result.updatedNestedTask;
                    oldNestedTask=result.oldNestedTask;
                }
                return result.updatedTree;
            });

            return {
                updatedTree: { ...task, dependencies: updatedDependencies },
                updatedNestedTask,
                oldNestedTask
            };
        }

        return { updatedTree: task, updatedNestedTask: null,oldNestedTask:null };
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



    const renderCell = (task, field) => {
        const isEditing = editingCell?.taskId == task.id && editingCell.field == field;
        return isEditing ? (
            <input
                type="text"
                value={task[field]}
                autoFocus
                onBlur={() => setEditingCell(null)}
                onChange={(e) => handleEdit(task.id, field, e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        setEditingCell(null);
                        dispatch(addDeltaAndPublish(delta, isConnected, client));
                        // dispatch(addDeltaAndPublish(deltas[deltas.length - 1],isConnected,client));
                        // setDeltas([])
                        setDelta(null)
                        // publish tasks to websocket
                        // console.log('delta ',delta);
                        // if(isConnected){
                        //     publishTasks(client,delta,'/app/task.handle')
                        // }
                    }
                }}
            />
        ) : (
            <span
                onClick={() => setEditingCell({ taskId: task.id, field })} // Enter editing mode on click
                style={{ cursor: "pointer" }}
            >
                {task[field]}
            </span>
        );
    }


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
                    {renderEmptyRow()}
                    {updatedTasks.map((task) => renderRow(task))}
                </tbody>
            </table>
        </div>





    )
}
export default GanttTable