import React from 'react'
import { useDrop } from 'react-dnd'

const KanbanColumn = ({ status, updateStatus }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'TASK',
    drop: (item) => updateStatus({ taskId: item.id, newStatus: status.key }),
    collect: (monitor) => ({
      isOver: monitor.isOver
    })
  }))

  return (
    <div ref={drop} className={`kanban-column paper-1 ${isOver ? 'highlight' : ''}`}>
      <h2>{status.label}</h2>
    </div>
  )
}

export default KanbanColumn