import React from "react"
import { useDrag } from 'react-dnd';
const Task = ({ task, index, status }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { ...task, currentStatus: status,index:index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  return (
    <li
      ref={drag}
      className="task"
      id={task.taskId}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
      }}
    >
      <h3>{task.title}</h3>
      <p>priority:{task.priority}</p>
      <p>estimated hours {task.estimatedHours}</p>
      <p>level {task.level}</p>
    </li>
  )
}
export default Task