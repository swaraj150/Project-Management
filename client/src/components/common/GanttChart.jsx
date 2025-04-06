import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { gantt } from 'dhtmlx-gantt'

import 'dhtmlx-gantt/codebase/dhtmlxgantt.css'

import { taskTypeLabels, taskPriorityLabels, taskLevelLabels } from '../../utils/task.utils'

const GanttChart = ({ tasks, projectId }) => {
  const ganttChartContainer = useRef(null)

  const navigate = useNavigate()

  useEffect(() => {
    // Define custom lightbox (popup) sections
    gantt.config.lightbox.sections = [
      { name: "title", height: 38, map_to: "title", type: "textarea", focus: true },
      { name: "description", height: 72, map_to: "description", type: "textarea" },
      { name: 'time', height: 72, map_to: 'auto', type: 'duration' },
      { name: 'type', height: 38, map_to: 'type', type: 'select', options: taskTypeLabels },
      { name: 'project', height: 38, map_to: 'projectId', type: 'select', options: [] },
      { name: 'priority', height: 38, map_to: 'priority', type: 'select', options: taskPriorityLabels },
      { name: 'level', height: 38, map_to: 'level', type: 'select', options: taskLevelLabels }
    ]

    gantt.init(ganttChartContainer.current)
    gantt.clearAll()
    gantt.detachAllEvents()

    gantt.locale.labels.section_title = 'Title'
    gantt.locale.labels.section_project = 'Project'
    gantt.locale.labels.section_priority = 'Priority'
    gantt.locale.labels.section_level = 'Level'

    // Prevent gantt from expanding indefinitely
    gantt.config.autofit = true
    gantt.config.autoscroll = true
    gantt.config.autosize_min_width = 1000
    gantt.config.auto_scheduling = false

    gantt.parse(tasks)

    gantt.attachEvent('onBeforeLightbox', (id) => {
      navigate('/tasks/create', { state: { parentTaskId: id, projectId } })
      return false
    })

    // // ✅ Handle Task Add Event
    // gantt.attachEvent('onAfterTaskAdd', (id, task) => {
    //   console.log('Task Added:', task)
    //   addTask(task)
    // })

    // // ✅ Handle Task Update Event
    // gantt.attachEvent('onAfterTaskUpdate', (id, task) => {
    //   console.log('Task Updated:', task)
    //   updateTask({ taskId: id, updatedTask: task })
    // })

    // Cleanup on unmount
    return () => {
      gantt.clearAll()
    }
  }, [])

  return <div className='gantt-chart-container' ref={ganttChartContainer}></div>
}

export default GanttChart
