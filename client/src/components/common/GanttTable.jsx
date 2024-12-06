import React, { useRef, useState } from "react";
import { useSelector } from "react-redux"
const renderTaskRow = (task, level = 0) => (
    <React.Fragment key={task.id}>
        <tr>

            <td >{task.id}</td>
            <td style={{ paddingLeft: `${level * 20}px` }} >{task.name}</td>
            <td>{task.start.toDateString()}</td>
            <td>{task.end.toDateString()}</td>
            <td>{task.progress}%</td>
        </tr>
        {task.dependencies.map((dependency) => renderTaskRow(dependency, level + 1))}
    </React.Fragment>
);

const GanttTable = () => {
    const tasks = useSelector((state) => state.gantt["tasks"])
    
    return (
        
         <div
         style={{
             overflowX: "auto",
             whiteSpace: "nowrap",
            //  border: "1px solid #ccc",
             height: "100%",
         }}
     >
         <table border="2" id="gantt-table">
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
                 {tasks.map((task) => renderTaskRow(task))}
             </tbody>
         </table>
     </div>





    )
}
export default GanttTable