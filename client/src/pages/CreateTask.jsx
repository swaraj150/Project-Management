import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Select from 'react-select'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { IoMdArrowBack } from 'react-icons/io'
import { MdOutlineCancel } from 'react-icons/md'
import { IoMdCreate } from 'react-icons/io'

import tasksApi from '../api/modules/tasks.api'

import Menu from '../components/common/Menu'

import { useSelection } from '../contexts/SelectionContext'

import { setActive } from '../redux/features/menuSlice'
import { addTaskToProject } from '../redux/features/projectsSlice'
import { addTask } from '../redux/features/tasksSlice'

import { menuIndices } from '../utils/menu.utils'
import { taskPriorityLabels, taskTypeLabels, taskLevelLabels, addSeconds } from '../utils/task.utils'

const CreateTask = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { collapsed } = useSelector((state) => state.menu)
  const { membersMap } = useSelector((state) => state.organization)
  const { teamsMap } = useSelector((state) => state.teams)
  const { projectsMap } = useSelector((state) => state.projects)

  const { selectedProject, parentTaskId } = useSelection()

  const startDateRef = useRef(null)

  const [startDateType, setStartDateType] = useState('text')
  const [assigneeOptions, setAssigneeOptions] = useState([])

  const handleGoBack = () => {
    navigate(-1)
  }

  const createTaskForm = useFormik({
    initialValues: {
      title: '',
      description: '',
      startDate: '',
      estimatedDays: '',
      assignedTo: null,
      priority: null,
      type: null,
      level: null
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
        .test('future-date', 'Start date must be today or in the future', (value) => {
          if (!value) return false
          const inputDate = new Date(value)
          const today = new Date()
          inputDate.setHours(0, 0, 0, 0)
          today.setHours(0, 0, 0, 0)
          return inputDate >= today
        }),
      estimatedDays: Yup.number()
        .moreThan(0, 'Estimated days must be greater than 0')
        .required('Estimated days are required'),
      assignedTo: Yup.array()
        .min(1, 'At least one assignee is required')
        .required('Assignees are required'),
      priority: Yup.object()
        .required('Priority is required'),
      type: Yup.object()
        .required('Task type is required'),
      level: Yup.object()
        .required('Task level is required'),
    }),
    onSubmit: async ({ title, description, startDate, estimatedDays, assignedTo, priority, type, level }) => {
      const { res, err } = await tasksApi.create({
        title,
        description,
        startDate,
        estimatedDays,
        assignedTo: assignedTo.map((member) => member.value),
        priority: priority.value,
        type: type.value,
        level: level.value,
        projectId: selectedProject.id,
        parentTaskId
      })
      if (res.task) {
        dispatch(addTask(res.task))
        dispatch(addTaskToProject({ projectId: selectedProject.id, taskId: res.task.id }))
        toast.success('Task created successfully!')
        createTaskForm.resetForm()
        setStartDateType('text')
      }
      if (err) toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')
    }
  })

  useEffect(() => {
    dispatch(setActive(menuIndices.tasks))
  }, [])

  useEffect(() => {
    if (!selectedProject) handleGoBack()
  }, [selectedProject])

  useEffect(() => {
    if (!projectsMap || !teamsMap || !selectedProject) return
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
    if (startDateType === 'datetime-local' && startDateRef.current) {
      startDateRef.current.showPicker?.()
    }
  }, [startDateType])

  useEffect(() => {
    console.log(createTaskForm.values.startDate)
  }, [createTaskForm.values.startDate])

  return (
    <section id='create-task'>
      <Menu />
      {
        selectedProject && (
          <section className={`content ${collapsed ? "expanded" : null}`} >
            <button className='go-back pointer paper-1' onClick={handleGoBack}>
              <IoMdArrowBack />
              <p>Go Back</p>
            </button>
            <form className="no-scrollbar" onSubmit={createTaskForm.handleSubmit}>
              <h2>Create new task</h2>
              <div className="input-field">
                <input
                  className='paper-1'
                  type='text'
                  name='title'
                  required
                  placeholder='Enter task title'
                  value={createTaskForm.values.title}
                  onChange={createTaskForm.handleChange}
                  onBlur={createTaskForm.handleBlur}
                />
                <p className="helper-text opacity-5">
                  {createTaskForm.touched.title && createTaskForm.errors.title ? createTaskForm.errors.title : ''}
                </p>
              </div>
              <div className="input-field">
                <textarea
                  className='paper-1'
                  name='description'
                  rows={1}
                  required
                  placeholder='Enter task description'
                  value={createTaskForm.values.description}
                  onChange={createTaskForm.handleChange}
                  onBlur={createTaskForm.handleBlur}
                />
                <p className="helper-text opacity-5">
                  {createTaskForm.touched.description && createTaskForm.errors.description ? createTaskForm.errors.description : ''}
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
                    value={createTaskForm.values.startDate}
                    onChange={(e) => createTaskForm.setFieldValue('startDate', addSeconds(e.target.value))}
                    onBlur={(e) => {
                      createTaskForm.handleBlur(e)
                      if (!createTaskForm.values.startDate) setStartDateType('text')
                    }}
                    onFocus={() => setStartDateType('datetime-local')}
                  />
                  <p className="helper-text opacity-5">
                    {createTaskForm.touched.startDate && createTaskForm.errors.startDate ? createTaskForm.errors.startDate : ''}
                  </p>
                </div>
                <div className="input-field">
                  <input
                    className='paper-1'
                    type='number'
                    name='estimatedDays'
                    required
                    placeholder='Enter estimated number of days'
                    value={createTaskForm.values.estimatedDays}
                    onChange={createTaskForm.handleChange}
                    onBlur={createTaskForm.handleBlur}
                  />
                  <p className="helper-text opacity-5">
                    {createTaskForm.touched.estimatedDays && createTaskForm.errors.estimatedDays ? createTaskForm.errors.estimatedDays : ''}
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
                  value={createTaskForm.values.assignedTo}
                  onChange={(option) => createTaskForm.setFieldValue('assignedTo', option)}
                  onBlur={() => createTaskForm.setFieldTouched('assignedTo', true)}
                />
                <p className="helper-text opacity-5">
                  {createTaskForm.touched.assignedTo && createTaskForm.errors.assignedTo ? createTaskForm.errors.assignedTo : ''}
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
                    value={createTaskForm.values.priority}
                    onChange={(option) => createTaskForm.setFieldValue('priority', option)}
                    onBlur={() => createTaskForm.setFieldTouched('priority', true)}
                  />
                  <p className="helper-text opacity-5">
                    {createTaskForm.touched.priority && createTaskForm.errors.priority ? createTaskForm.errors.priority : ''}
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
                    value={createTaskForm.values.type}
                    onChange={(option) => createTaskForm.setFieldValue('type', option)}
                    onBlur={() => createTaskForm.setFieldTouched('type', true)}
                  />
                  <p className="helper-text opacity-5">
                    {createTaskForm.touched.type && createTaskForm.errors.type ? createTaskForm.errors.type : ''}
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
                    value={createTaskForm.values.level}
                    onChange={(option) => createTaskForm.setFieldValue('level', option)}
                    onBlur={() => createTaskForm.setFieldTouched('level', true)}
                  />
                  <p className="helper-text opacity-5">
                    {createTaskForm.touched.level && createTaskForm.errors.level ? createTaskForm.errors.level : ''}
                  </p>
                </div>
              </div>
              <div className="cta">
                <button className="pointer paper-1" type='button' onClick={handleGoBack}>
                  <MdOutlineCancel />
                  Cancel
                </button>
                <button
                  className="dark-btn pointer paper-1"
                  type='submit'
                  disabled={createTaskForm.isSubmitting || !createTaskForm.isValid}
                >
                  <IoMdCreate />
                  Create
                </button>
              </div>
            </form>
          </section>
        )
      }
    </section>
  )
}

export default CreateTask