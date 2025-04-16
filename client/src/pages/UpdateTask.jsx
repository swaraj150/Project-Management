import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Select from 'react-select'
import ReactSlider from 'react-slider'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { IoMdArrowBack } from 'react-icons/io'
import { MdOutlineCancel, MdDelete } from 'react-icons/md'
import { RxUpdate } from 'react-icons/rx'

import tasksApi from '../api/modules/tasks.api'

import Menu from '../components/common/Menu'

import { useProject } from '../contexts/ProjectContext'

import { setActive } from '../redux/features/menuSlice'
import { deleteTaskFromProject } from '../redux/features/projectsSlice'
import { deleteTask, updateTask } from '../redux/features/tasksSlice'

import { menuIndices } from '../utils/menu.utils'
import { addSeconds, taskLevelLabels, taskPriorityLabels, taskStatuses, taskStatusLabels, taskTypeLabels } from '../utils/task.utils'

const UpdateTask = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { collapsed } = useSelector((state) => state.menu)
  const { membersMap } = useSelector((state) => state.organization)
  const { teamsMap } = useSelector((state) => state.teams)
  const { projectsMap } = useSelector((state) => state.projects)

  const { selectedTask, selectedProject, handleUpdateTask } = useProject()

  const startDateRef = useRef(null)
  const initialFormValues = useRef(null)

  const [dataInitialized, setDataInitialized] = useState(false)
  const [startDateType, setStartDateType] = useState('datetime-local')
  const [assigneeOptions, setAssigneeOptions] = useState([])

  const handleGoBack = () => {
    navigate(-1)
  }

  const updateTaskForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: '',
      description: '',
      startDate: '',
      estimatedDays: '',
      assignedTo: [],
      priority: null,
      type: null,
      level: null,
      status: null,
      progress: 0
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .min(3, 'Title must be at least 3 characters')
        .max(100, 'Title cannot exceed 100 characters')
        .required('Title is required'),
      description: Yup.string()
        .max(500, 'Description cannot exceed 500 characters')
        .required('Description is required'),
      startDate: Yup.string()
        .required('Start date is required')
        .test(
          'future-date-if-changed',
          'Start date must be today or in the future',
          function (value) {
            if (!value) return false
            if (value === selectedTask?.startDate) return true
            const inputDate = new Date(value)
            const today = new Date()
            return inputDate >= today
          }
        ),
      estimatedDays: Yup.number()
        .moreThan(0, 'Estimated days must be greater than 0')
        .required('Estimated days are required')
        .test(
          'end-date-not-in-past',
          'End date (startDate + estimatedDays) must not be in the past',
          function (estimatedDays) {
            const { startDate } = this.parent
            if (!startDate || !estimatedDays) return false
            if (estimatedDays === selectedTask?.estimatedDays) return true
            const start = new Date(startDate)
            const end = new Date(start)
            end.setDate(end.getDate() + estimatedDays)
            const now = new Date()
            now.setHours(0, 0, 0, 0)
            return end >= now
          }
        ),
      assignedTo: Yup.array()
        .min(1, 'At least one assignee is required')
        .required('Assigned to is required'),
      priority: Yup.object()
        .required('Priority is required'),
      type: Yup.object()
        .required('Task type is required'),
      level: Yup.object()
        .required('Task level is required'),
      status: Yup.object()
        .required('Status is required'),
      progress: Yup.number()
        .required('Progress is required')
        .min(0, 'Progress cannot be less than 0')
        .max(1, 'Progress cannot exceed 100%')
    }),
    onSubmit: async ({ title, description, startDate, estimatedDays, assignedTo, priority, type, level, status, progress }) => {
      handleUpdateTask({
        ...selectedTask,
        title,
        description,
        startDate,
        estimatedDays,
        assignedTo: assignedTo.map((member) => member.value),
        priority: priority.value,
        type: type.value,
        level: level.value,
        status: status.value,
        progress: Math.round(updateTaskForm.values.progress * 100)
      })
      handleGoBack()
    }
  })

  const isFormUnchanged = () => {
    if (!initialFormValues.current) return true
    const curr = updateTaskForm.values
    const init = initialFormValues.current
    return (
      curr.title === init.title &&
      curr.description === init.description &&
      curr.startDate === init.startDate &&
      curr.estimatedDays === init.estimatedDays &&
      curr.progress === init.progress &&
      JSON.stringify(curr.assignedTo) === JSON.stringify(init.assignedTo) &&
      curr.priority?.value === init.priority?.value &&
      curr.type?.value === init.type?.value &&
      curr.level?.value === init.level?.value &&
      curr.status?.value === init.status?.value
    )
  }

  const handleDelete = async () => {
    const { res, err } = await tasksApi.delete({ taskId: selectedTask.id })
    if (res) {
      dispatch(deleteTaskFromProject({ projectId: selectedProject.id, taskId: selectedTask.id }))
      dispatch(deleteTask({ id: selectedTask.id }))
      toast.success('Task deleted successfully!')
      handleGoBack()
    }
    if (err) toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')
  }

  useEffect(() => {
    dispatch(setActive(menuIndices.tasks))
  }, [])

  useEffect(() => {
    if (!selectedTask) handleGoBack()
  }, [selectedTask])

  useEffect(() => {
    if (selectedTask && membersMap) {
      const values = {
        title: selectedTask.title,
        description: selectedTask.description,
        startDate: selectedTask.startDate,
        estimatedDays: selectedTask.estimatedDays,
        assignedTo: selectedTask?.assignedTo.map((member) => ({ value: member, label: membersMap[member].name })),
        priority: taskPriorityLabels.find((p) => p.value === selectedTask.priority),
        type: taskTypeLabels.find((t) => t.value === selectedTask.type),
        level: taskLevelLabels.find((l) => l.value === selectedTask.level),
        status: taskStatusLabels.find((s) => s.value === selectedTask.status),
        progress: selectedTask.progress
      }
      updateTaskForm.setValues(values)
      initialFormValues.current = values
      setDataInitialized(true)
    }
  }, [selectedTask, membersMap])

  useEffect(() => {
    if (!selectedProject || !projectsMap || !teamsMap) return
    const projectMembersSet = new Set()
    selectedProject.teams.forEach((teamId) => {
      const team = teamsMap[teamId]
      if (team) {
        team.developers?.forEach((developer) => projectMembersSet.add(developer))
        team.testers?.forEach((tester) => projectMembersSet.add(tester))
        projectMembersSet.add(team.teamLead)
      }
    })
    const assigneeOptions = Array.from(projectMembersSet).map((memberId) => ({
      value: memberId,
      label: membersMap[memberId]?.name
    }))
    setAssigneeOptions(assigneeOptions)
  }, [selectedProject, teamsMap, membersMap, setAssigneeOptions])

  useEffect(() => {
    if (updateTaskForm.values.progress === 0) updateTaskForm.setFieldValue('status', taskStatusLabels.find((s) => s.value === taskStatuses.pending))
    else if (updateTaskForm.values.progress === 1) updateTaskForm.setFieldValue('status', taskStatusLabels.find((s) => s.value === taskStatuses.completed))
    else updateTaskForm.setFieldValue('status', taskStatusLabels.find((s) => s.value === taskStatuses.inProgress))
  }, [updateTaskForm.values.progress])

  useEffect(() => {
    if (dataInitialized && updateTaskForm.values.startDate === '' && startDateType === 'datetime-local' && startDateRef.current) {
      startDateRef.current.showPicker?.()
    }
  }, [startDateType, updateTaskForm.values.startDate, dataInitialized])


  return (
    <section id='update-task'>
      <Menu />
      <section className={`content ${collapsed ? "expanded" : null}`} >
        <button className='go-back pointer paper-1' onClick={handleGoBack}>
          <IoMdArrowBack />
          <p>Go Back</p>
        </button>
        <form className="no-scrollbar" onSubmit={updateTaskForm.handleSubmit}>
          <h2>Update task</h2>
          <div className="input-field">
            <input
              className='paper-1'
              type='text'
              name='title'
              required
              placeholder='Enter task title'
              value={updateTaskForm.values.title}
              onChange={updateTaskForm.handleChange}
              onBlur={updateTaskForm.handleBlur}
            />
            <p className="helper-text opacity-5">
              {updateTaskForm.touched.title && updateTaskForm.errors.title ? updateTaskForm.errors.title : ''}
            </p>
          </div>
          <div className="input-field">
            <textarea
              className='paper-1'
              name='description'
              rows={1}
              required
              placeholder='Enter task description'
              value={updateTaskForm.values.description}
              onChange={updateTaskForm.handleChange}
              onBlur={updateTaskForm.handleBlur}
            />
            <p className="helper-text opacity-5">
              {updateTaskForm.touched.description && updateTaskForm.errors.description ? updateTaskForm.errors.description : ''}
            </p>
          </div>
          <div className="date-duration-group">
            <div className="input-field">
              <input
                ref={startDateRef}
                className='paper-1'
                type={startDateType}
                name='startDate'
                required
                placeholder='Enter start date'
                value={updateTaskForm.values.startDate}
                onChange={(e) => updateTaskForm.setFieldValue('startDate', addSeconds(e.target.value))}
                onBlur={(e) => {
                  updateTaskForm.handleBlur(e)
                  if (!updateTaskForm.values.startDate) setStartDateType('text')
                }}
                onFocus={() => setStartDateType('datetime-local')}
              />
              <p className="helper-text opacity-5">
                {updateTaskForm.touched.startDate && updateTaskForm.errors.startDate ? updateTaskForm.errors.startDate : ''}
              </p>
            </div>
            <div className="input-field">
              <input
                className='paper-1'
                type='number'
                name='estimatedDays'
                required
                placeholder='Enter estimated number of days'
                value={updateTaskForm.values.estimatedDays}
                onChange={updateTaskForm.handleChange}
                onBlur={updateTaskForm.handleBlur}
              />
              <p className="helper-text opacity-5">
                {updateTaskForm.touched.estimatedDays && updateTaskForm.errors.estimatedDays ? updateTaskForm.errors.estimatedDays : ''}
              </p>
            </div>
          </div>
          <div className="input-field">
            <Select
              className="paper-1 select"
              isSearchable
              isMulti
              isClearable
              options={assigneeOptions}
              name='assignedTo'
              placeholder="Select assignees"
              value={updateTaskForm.values.assignedTo}
              onChange={(option) => updateTaskForm.setFieldValue('assignedTo', option)}
              onBlur={() => updateTaskForm.setFieldTouched('assignedTo', true)}
            />
            <p className="helper-text opacity-5">
              {updateTaskForm.touched.assignedTo && updateTaskForm.errors.assignedTo ? updateTaskForm.errors.assignedTo : ''}
            </p>
          </div>
          <div className="task-meta-group">
            <div className="input-field">
              <Select
                className="paper-1 select"
                isSearchable
                isClearable
                options={taskPriorityLabels}
                name='priority'
                placeholder="Select priority"
                value={updateTaskForm.values.priority}
                onChange={(option) => updateTaskForm.setFieldValue('priority', option)}
                onBlur={() => updateTaskForm.setFieldTouched('priority', true)}
              />
              <p className="helper-text opacity-5">
                {updateTaskForm.touched.priority && updateTaskForm.errors.priority ? updateTaskForm.errors.priority : ''}
              </p>
            </div>
            <div className="input-field">
              <Select
                className="paper-1 select"
                isSearchable
                isClearable
                options={taskTypeLabels}
                name='type'
                placeholder="Select type"
                value={updateTaskForm.values.type}
                onChange={(option) => updateTaskForm.setFieldValue('type', option)}
                onBlur={() => updateTaskForm.setFieldTouched('type', true)}
              />
              <p className="helper-text opacity-5">
                {updateTaskForm.touched.type && updateTaskForm.errors.type ? updateTaskForm.errors.type : ''}
              </p>
            </div>
            <div className="input-field">
              <Select
                className="paper-1 select"
                isSearchable
                isClearable
                options={taskLevelLabels}
                name='priority'
                placeholder="Select level"
                value={updateTaskForm.values.level}
                onChange={(option) => updateTaskForm.setFieldValue('level', option)}
                onBlur={() => updateTaskForm.setFieldTouched('level', true)}
              />
              <p className="helper-text opacity-5">
                {updateTaskForm.touched.level && updateTaskForm.errors.level ? updateTaskForm.errors.level : ''}
              </p>
            </div>
            <div className="input-field">
              <Select
                className="paper-1 select"
                isSearchable
                isClearable
                options={taskStatusLabels}
                name='status'
                placeholder="Select status"
                value={updateTaskForm.values.status}
                onChange={(option) => updateTaskForm.setFieldValue('status', option)}
                onBlur={() => updateTaskForm.setFieldTouched('status', true)}
              />
              <p className="helper-text opacity-5">
                {updateTaskForm.touched.status && updateTaskForm.errors.status ? updateTaskForm.errors.status : ''}
              </p>
            </div>
          </div>
          <div className="input-field range-slider-field">
            <label className="slider-label">
              Progress: <strong>{Math.round(updateTaskForm.values.progress * 100)}%</strong>
            </label>
            <ReactSlider
              className="custom-slider paper-1"
              thumbClassName="custom-thumb"
              trackClassName="custom-track"
              value={Math.round(updateTaskForm.values.progress * 100)}
              min={0}
              max={100}
              step={1}
              name='progress'
              onChange={(value) => {
                const fixed = +(value / 100).toFixed(2)
                updateTaskForm.setFieldValue('progress', fixed)
              }}
              onAfterChange={() => updateTaskForm.setFieldTouched('progress', true)}
              onBlur={() => updateTaskForm.setFieldTouched('progress', true)}
            />
            <p className="helper-text opacity-5">
              {updateTaskForm.touched.progress && updateTaskForm.errors.progress ? updateTaskForm.errors.progress : ''}
            </p>
          </div>
          <div className="cta">
            <button className="pointer paper-1" type='button' onClick={handleGoBack}>
              <MdOutlineCancel />
              Cancel
            </button>
            <button className="pointer paper-1" type='button' onClick={handleDelete}>
              <MdDelete />
              Delete
            </button>
            <button
              className="pointer paper-1 dark-btn"
              type='submit'
              disabled={updateTaskForm.isSubmitting || !updateTaskForm.isValid || isFormUnchanged()}
            >
              <RxUpdate />
              Update
            </button>
          </div>
        </form>
      </section>
    </section>
  )
}

export default UpdateTask