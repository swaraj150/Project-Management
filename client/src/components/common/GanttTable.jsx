import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { setTasks } from "../../redux/features/ganttSlice";
import { addDelta } from "../../redux/features/webSocketSlice";
import { extractDeltas } from "../../utils/task.utils";
import { addDeltaAndPublish, publishTasks } from "../../utils/websocket.utils";


const GanttTable = () => {
    const tasks = useSelector((state) => state.gantt["tasks"]);
    const delta=useSelector((state)=>state.webSocket.deltas);
    const isConnected = useSelector((state) => state.webSocket.connected);
    const client = useSelector((state) => state.webSocket.client);
    const [editingCell, setEditingCell] = useState(null);
    const [updatedTasks, setUpdatedTasks] = useState(tasks);
    const [deltas, setDeltas] = useState([]);
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

        const updatedTasksList = updatedTasks.map((task) =>
            // task.id === taskId ? { ...task, [field]: value } : task
            updateTaskFields(taskId, task, field, value)
        );
        setDeltas(extractDeltas(updatedTasks, updatedTasksList));
        setUpdatedTasks(updatedTasksList);
        dispatch(setTasks({ tasks: updatedTasks }));

    };


    const updateTaskFields = (id, task, field, value) => {
        if (id === task.id) {
            return { ...task, [field]: value };
        }

        if (task.dependencies) {
            const updatedDependencies = task.dependencies.map((subTask) =>
                updateTaskFields(id, subTask, field, value)
            );
            return { ...task, dependencies: updatedDependencies };
        }

        return task;
    };



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
                        dispatch(addDeltaAndPublish(deltas[deltas.length - 1],isConnected,client));
                        setDeltas([])
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