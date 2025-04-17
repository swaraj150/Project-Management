import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Select from 'react-select'
import { gantt } from 'dhtmlx-gantt'
import { toast } from 'react-toastify'

import 'dhtmlx-gantt/codebase/dhtmlxgantt.css'

import tasksApi from '../../api/modules/tasks.api'

import { useProject } from '../../contexts/ProjectContext'

import { addLinkToProject, deleteLinkFromProject } from '../../redux/features/projectsSlice'
import { addLink, deleteLink, updateTask } from '../../redux/features/tasksSlice'

import { roles } from '../../utils/organization.utils'
import { taskTypeLabels, taskPriorityLabels, taskLevelLabels, extendTask, extendLink, linkTypesReverse, toDatetimeLocal, taskStatuses } from '../../utils/task.utils'

const scaleConfigs = {
  days: {
    scale_unit: 'day',
    date_scale: '%d %M',
    step: 1,
    subscales: [
      { unit: 'hour', step: 6, date: '%H:%i' }
    ]
  },
  weeks: {
    scale_unit: 'week',
    date_scale: 'Week #%W',
    step: 1,
    subscales: [
      { unit: 'day', step: 1, date: '%d %M' }
    ]
  },
  months: {
    scale_unit: 'month',
    date_scale: '%F, %Y',
    step: 1,
    subscales: [
      { unit: 'week', step: 1, date: 'Week #%W' }
    ]
  },
  quarters: {
    scale_unit: 'month',
    date_scale: '%F, %Y',
    step: 1,
    subscales: [
      { unit: 'month', step: 1, date: '%M' }
    ]
  },
  years: {
    scale_unit: 'year',
    date_scale: '%Y',
    step: 1,
    subscales: [
      { unit: 'month', step: 1, date: '%M' }
    ]
  }
}

const scales = [
  { value: 'days', label: 'Days' },
  { value: 'weeks', label: 'Weeks' },
  { value: 'months', label: 'Months' },
  { value: 'quarters', label: 'Quarters' },
  { value: 'years', label: 'Years' }
]

const disallowedRoles = [roles.teamLead, roles.developer, roles.qa]

const GanttChart = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const ganttChart = useRef(null)

  const { user } = useSelector((state) => state.user)
  const { tasksMap, linksMap } = useSelector((state) => state.tasks)

  const { selectedProject, setParentTaskId, setSelectedTask, handleUpdateTask } = useProject()

  const [currentScale, setCurrentScale] = useState('days')

  const handleAddLink = async (link) => {
    const { res, err } = await tasksApi.createLink({ ...link })
    if (res.link) {
      dispatch(addLinkToProject({ projectId: selectedProject.id, linkId: res.link.id }))
      dispatch(addLink(res.link))
      toast.success('Link added successfully!')
    }
    if (err) toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')
  }

  const handleDeleteLink = async (linkId) => {
    const { res, err } = await tasksApi.deleteLink({ linkId })
    if (res) {
      dispatch(deleteLinkFromProject({ projectId: selectedProject.id, linkId }))
      dispatch(deleteLink({ id: linkId }))
      toast.success('Link deleted successfully!')
    }
    if (err) toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')
  }

  useEffect(() => {
    if (!tasksMap || !linksMap) return

    // Lightbox Configuration
    gantt.config.lightbox.sections = [
      { name: 'title', height: 38, map_to: 'title', type: 'textarea', focus: true },
      { name: 'description', height: 72, map_to: 'description', type: 'textarea' },
      { name: 'time', height: 72, map_to: 'auto', type: 'duration' },
      { name: 'type', height: 38, map_to: 'type', type: 'select', options: taskTypeLabels },
      { name: 'project', height: 38, map_to: 'projectId', type: 'select', options: [] },
      { name: 'priority', height: 38, map_to: 'priority', type: 'select', options: taskPriorityLabels },
      { name: 'level', height: 38, map_to: 'level', type: 'select', options: taskLevelLabels }
    ]

    // Label overrides
    gantt.locale.labels.section_title = 'Title'
    gantt.locale.labels.section_project = 'Project'
    gantt.locale.labels.section_priority = 'Priority'
    gantt.locale.labels.section_level = 'Level'

    // Gantt Configuration
    gantt.config = {
      ...gantt.config,
      autofit: true,
      autoscroll: true,
      autosize_min_width: 1000,
      auto_scheduling: true,
      auto_scheduling_strict: true,
      time_step: 60,
      scale_height: 48,
      xml_date: '%Y-%m-%d %H:%i',
      start_on_monday: true,
      order_branch: true,
      open_tree_initially: true,
      smart_rendering: true,
      duration_unit: 'day',
      duration_step: 1,
      show_task_cells: false,
      zoom: true
    }

    // Permission-based behavior
    if (disallowedRoles.includes(user.projectRole)) {
      gantt.config = {
        ...gantt.config,
        drag_move: false,
        drag_resize: false,
        drag_links: false,
        details_on_create: false,
        details_on_dblclick: false,
        buttons_left: [],
        buttons_right: [],
        show_plus: false,
        add_column: false
      }
    } else {
      gantt.config.drag_links = true
    }

    // Apply scale
    const applyScale = (scale) => {
      const config = scaleConfigs[scale]
      if (config) {
        gantt.config.scales = [
          { unit: config.scale_unit, step: config.step || 1, format: config.date_scale },
          ...(config.subscales || []).map(sub => ({
            unit: sub.unit,
            step: sub.step,
            format: sub.date
          }))
        ]
        gantt.render()
      }
    }

    applyScale(currentScale)

    // Gantt Init
    gantt.init(ganttChart.current)
    gantt.clearAll()
    gantt.detachAllEvents()

    // Load data
    gantt.parse({
      data: selectedProject.tasks.data.map((taskId) => extendTask(tasksMap[taskId])),
      links: selectedProject.tasks.links.map((linkId) => extendLink(linksMap[linkId]))
    })

    gantt.showDate(new Date())

    // Task Events
    gantt.attachEvent('onBeforeTaskAdd', function (id, task) {
      if (disallowedRoles.includes(user.projectRole)) {
        toast.error('You don\'t have permission to create tasks.')
        return false
      }
      return true
    })

    gantt.attachEvent('onAfterTaskUpdate', function (id, task) {
      const { title, description, start_date, duration, assignedTo, priority, type, level, status, progress } = task
      handleUpdateTask({
        ...tasksMap[id],
        title,
        description,
        startDate: toDatetimeLocal(start_date),
        estimatedDays: duration,
        assignedTo: assignedTo,
        priority: priority,
        type: type,
        level: level,
        status: progress === 1 ? taskStatuses.completed : (progress === 0 ? taskStatuses.pending : taskStatuses.inProgress),
        progress: Math.round(progress * 100)
      })
    })

    gantt.attachEvent('onTaskClick', function (id, e) {
      const task = tasksMap[id]
      setSelectedTask({ ...task, progress: +(task.progress / 100).toFixed(2) })
      return true
    })

    // ✅ LINK EVENTS
    gantt.attachEvent('onAfterLinkAdd', function (id, link) {
      handleAddLink({ source: link.source, target: link.target, type: linkTypesReverse[link.type] })
    })

    gantt.attachEvent('onAfterLinkDelete', function (id, link) {
      handleDeleteLink(id)
    })

    // 🔁 Lightbox redirect logic
    gantt.attachEvent('onBeforeLightbox', (id) => {
      const task = gantt.getTask(id)
      if (task.$new === true) {
        setParentTaskId(task.parent === 0 ? null : task.parent)
        navigate('create')
      } else {
        navigate('update')
      }
      return false // prevent default lightbox
    })

    return () => {
      gantt.clearAll()
    }
  }, [currentScale, selectedProject.tasks, tasksMap, linksMap])

  return (
    <div className='gantt-chart-container'>
      <Select
        className='paper-1 select'
        isSearchable
        options={scales}
        name='scale'
        placeholder='Select scale'
        value={currentScale ? scales.find((scale) => scale.value === currentScale) : null}
        onChange={(option) => setCurrentScale(option ? option.value : null)}
      />
      <div className={`gantt-chart ${disallowedRoles.includes(user.projectRole) ? 'hide-add-column' : ''}`} ref={ganttChart}></div>
    </div>
  )
}

export default GanttChart
