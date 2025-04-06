import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import KanbanColumn from './KanbanColumn'

import { taskStatusLabels } from '../../utils/task.utils'

const KanbanBoard = ({ tasks, updateTask }) => {
  const updateStatus = ({ taskId, newStatus }) => {
    console.log(taskId, newStatus)
  }

  return (
    <div className="kanban-board-container">
      <DndProvider backend={HTML5Backend}>
        {taskStatusLabels.map((status, index) => <KanbanColumn key={index} status={status} updateStatus={updateStatus} />)}
      </DndProvider>
    </div>
  )
}

export default KanbanBoard