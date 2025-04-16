import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import KanbanColumn from './KanbanColumn'

import { taskStatusLabels } from '../../utils/task.utils'

const KanbanBoard = () => {  
  return (
    <div className="kanban-board-container">
      <DndProvider backend={HTML5Backend}>
        {taskStatusLabels.map((status, index) => <KanbanColumn key={index} status={status} />)}
      </DndProvider>
    </div>
  )
}

export default KanbanBoard