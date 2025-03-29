import React from 'react'

import KanbanColumn from './KanbanColumn'

import { taskStatusLabels } from '../../utils/task.utils'

const KanbanBoard = ({ tasks, updateTask }) => {
  return (
    <div className="kanban-board-container">
      {taskStatusLabels.map((index, status) => <KanbanColumn key={index} title={status.label} />)}
    </div>
  )
}

export default KanbanBoard