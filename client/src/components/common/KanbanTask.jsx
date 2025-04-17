import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useDrag } from 'react-dnd'

import { useSelection } from '../../contexts/SelectionContext'

import { roles } from '../../utils/organization.utils'
import { taskLevelLabels, taskPriorities, taskPriorityLabels } from '../../utils/task.utils'

const KanbanTask = ({ task }) => {
  const navigate = useNavigate()

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TASK',
    item: { task },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }))

  const { user } = useSelector((state) => state.user)

  const { setSelectedTask } = useSelection()

  const handleClick = () => {
    if (user.projectRole === roles.teamLead || user.projectRole === roles.developer || user.projectRole === roles.qa) return
    setSelectedTask(task)
    navigate('update')
  }

  const formatDate = (dateStr) => new Date(dateStr).toISOString().split('T')[0]

  const startDate = new Date(task.startDate)
  const endDate = new Date(startDate)

  endDate.setDate(startDate.getDate() + (task.estimatedDays || 0))

  return (
    <div
      ref={drag}
      className='kanban-task pointer'
      style={{ opacity: isDragging ? 0.5 : 1 }}
      onClick={handleClick}
    >
      <h4>{task.title}</h4>
      <p className='description'>{task.description}</p>
      <div className="task-meta-group">
        <p>
          Priority:&nbsp;
          <strong className={`priority-${task.priority.toLowerCase()}`}>
            {taskPriorityLabels.find((l) => l.value === task.priority).label}
          </strong>
        </p>
        <p>
          Level:&nbsp;
          <strong className={`level-${task.level.toLowerCase()}`}>
            {taskLevelLabels.find((l) => l.value === task.level).label}
          </strong>
        </p>
      </div>
      <small>{`${formatDate(startDate)} – ${formatDate(endDate)}`}</small>
    </div>
  )
}

export default KanbanTask
