import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Task from "./Task";
import { useDrop } from 'react-dnd';
import { moveTask } from "../../redux/features/kanbanSlice";


const KanbanTasks = ({ status }) => {

  const tasks = useSelector((state) => state.kanban[status])
  const dispatch = useDispatch();
  const [{ isOver }, drop] = useDrop({
    accept: "task",
    drop: (draggedTask) => {
      if (draggedTask.currentStatus !== status) {
        dispatch(moveTask({ task: draggedTask, toStatus: status }));
      }

    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <ul ref={drop}
      className="task-list"
      style={{
        backgroundColor: isOver ? "#e3e3e3" : "transparent",
        minHeight: "100px", 
      }}
    >
      {
        tasks?.map((task) => {
          return <Task key={task.taskId} task={task} status={status} />
        })
      }
    </ul>
  )
}
export default KanbanTasks