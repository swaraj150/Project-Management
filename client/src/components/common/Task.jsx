import React from "react"
import { useDrag } from 'react-dnd';
const Task = ({ task, kanbanIndex, status }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { ...task, currentStatus: status,kanbanIndex:kanbanIndex },
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
      <h3>{task.name}</h3>
      <p>progress:{task.progress}</p>
      <p>estimated hours {task.estimatedHours}</p>
      <p>level {task.level}</p>
    </li>
  )
}
export default Task