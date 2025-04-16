import React from 'react'
import { useSelector } from 'react-redux'
import { useDrop } from 'react-dnd'

import KanbanTask from './KanbanTask'

import { useProject } from '../../contexts/ProjectContext'

import { taskStatuses } from '../../utils/task.utils'

const KanbanColumn = ({ status }) => {
  const { tasksMap } = useSelector((state) => state.tasks)

  const { selectedProject, handleUpdateTask } = useProject()

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'TASK',
    drop: ({ task }) => {
      if (task.status === status.value) return
      handleUpdateTask({
        ...task,
        status: status.value,
        progress: status.value === taskStatuses.completed ? 100 : 0
      })
    },
    collect: (monitor) => ({
      isOver: monitor.isOver
    })
  }))

  return (
    <div ref={drop} className={`kanban-column paper-1 ${isOver ? 'highlight' : ''}`}>
      <h2>{status.label}</h2>
      <div className="tasks no-scrollbar">
        {selectedProject.tasks.data.map((taskId, index) => {
          const task = tasksMap[taskId]
          if (task.status === status.value) return (<KanbanTask key={index} task={task} />)
        })}
      </div>
    </div>
  )
}

export default KanbanColumn