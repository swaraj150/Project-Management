import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Task from "./Task";
import { useDrop } from 'react-dnd';
import { moveTask } from "../../redux/features/kanbanSlice";


const KanbanTasks = ({ status }) => {
  const [targetIndices,setTargetIndices]=useState({});
  const tasks = useSelector((state) => state.kanban[status])
  const dispatch = useDispatch();
  const [{ isOver }, drop] = useDrop({
    accept: "task",
    drop: (draggedTask) => {
      try {
        // const targetIndex = draggedTask.targetIndex || tasks.length;
        const targetIndex = targetIndices[draggedTask.taskId] ?? tasks.length;
        dispatch(moveTask({ task: draggedTask, toStatus: status, targetIndex }));
        setTargetIndices((prev) => {
          const newState = { ...prev };
          delete newState[draggedTask.taskId];
          return newState;
        });
        console.log("dropped successfully")
      } catch (error) {
        console.error("Error in drop method:", error);
      }
    },
    
    hover: (draggedTask, monitor) => {
      try {
        const draggedIndex = draggedTask.index;
        console.log(draggedIndex)
        const clientOffset = monitor.getClientOffset()

        let hoverIndex = tasks.findIndex((task) => {

          const hoveredTask = document.getElementById(`${task.taskId}`)
          console.log("hovered task candidate ", hoveredTask.id)
          if (!hoveredTask) return false;
          const hoverBoundingRect = hoveredTask.getBoundingClientRect()
          console.log(hoverBoundingRect)
          const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
          const hoverClientY = clientOffset.y - hoverBoundingRect.top
          console.log(hoverMiddleY)
          console.log(hoverClientY)
          console.log(clientOffset)
          return hoverClientY < hoverMiddleY;
        })

        if (hoverIndex < 0) {
          hoverIndex = tasks.length;
        }
        console.log("hoverIndex: ", hoverIndex)
        setTargetIndices((prev) => ({
          ...prev,
          [draggedTask.taskId]: hoverIndex,
        }));
        
      } catch (error) {
        console.error("Error in hover method:", error, {
          draggedTask,
          status,
          tasks,
        });
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
        tasks?.map((task, index) => {
          return <Task key={task.taskId} task={task} status={status} index={index} />
        })
      }
    </ul>
  )
}
export default KanbanTasks