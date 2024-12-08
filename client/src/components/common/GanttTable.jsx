import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { updateTasks } from "../../redux/features/ganttSlice";


const GanttTable = () => {
    const tasks = useSelector((state) => state.gantt["tasks"])
    const [editingCell, setEditingCell] = useState(null);
    const [updatedTasks, setUpdatedTasks] = useState(tasks);
    const dispatch=useDispatch();
    const renderTaskRow = (task, level = 0) => (
        <React.Fragment key={task.id}>
            <tr>

                <td>{task.id}</td>
                <td style={{ paddingLeft: `${level * 20}px` }} >{renderCell(task, "name")}</td>
                <td>{task.start.toDateString()}</td>
                <td>{task.end.toDateString()}</td>
                <td>{renderCell(task, "progress")}%</td>
            </tr>
            {task.dependencies.map((dependency) => renderTaskRow(dependency, level + 1))}

        </React.Fragment>

    );
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
            task.id === taskId ? { ...task, [field]: value } : task
        );
        setUpdatedTasks(updatedTasksList);
        dispatch(updateTasks({ tasks: updatedTasksList }));
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