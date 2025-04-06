import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import Select from 'react-select'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { IoMdArrowBack } from 'react-icons/io'

import Menu from '../components/common/Menu'

import { setActive } from '../redux/features/menuSlice'
import { addTask } from '../redux/features/tasksSlice'

import { menuIndices } from '../utils/menu.utils'
import { setInputType } from '../utils/input.utils'
import { taskPriorityLabels, taskTypeLabels, taskLevelLabels } from '../utils/task.utils'

const CreateTask = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { parentTaskId, projectId } = location.state || {}

  const { collapsed } = useSelector((state) => state.menu)

  const [assigneeOptions, setAssigneeOptions] = useState([])

  const handleGoBack = () => {
    navigate(-1)
  }

  useEffect(() => {
    dispatch(setActive(menuIndices.tasks))
  }, [])

  useEffect(() => {
    if (!projectId) handleGoBack()
  }, [])

  const createTaskForm = useFormik({
    initialValues: {
      title: '',
      description: '',
      startDate: '',
      estimatedDays: 0,
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
        .test('future-date', 'Start date must be in the future', (value) => {
          return new Date(value) > new Date();
        }),
      estimatedDays: Yup.number()
        .moreThan(0, 'Estimated days must be greater than 0')
        .required('Estimated days are required'),
      assignedTo: Yup.array()
        .min(1, 'At least one assignee is required')
        .required('Assigned to is required'),
      priority: Yup.object()
        .required('Priority is required'),
      type: Yup.object()
        .required('Task type is required'),
      level: Yup.object()
        .required('Task level is required'),
    }),
    onSubmit: async ({ title, description, startDate, estimatedDays, assignedTo, priority, type, level }) => {
      dispatch(addTask({ title, description, startDate, estimatedDays, assignedTo, priority, type, level, projectId, parentTaskId }))
    }
  })

  return (
    <section id='create-task'>
      <Menu />
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
            <input
              className='paper-1'
              type='textarea'
              name='description'
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
          <div className="input-field">
            <input
              className='paper-1'
              type='text'
              name='startDate'
              required
              placeholder='Enter start date'
              value={createTaskForm.values.startDate}
              onChange={createTaskForm.handleChange}
              onBlur={(e) => {
                if (!e.target.value) setInputType({ e, newType: 'text' })
              }}
              onFocus={(e) => setInputType({ e, newType: 'date' })}
            />
            <p className="helper-text opacity-5">
              {createTaskForm.touched.startDate && createTaskForm.errors.startDate ? createTaskForm.errors.startDate : ''}
            </p>
          </div>
          <div className="input-field">
            <Select
              className="paper-1 select"
              isSearchable
              isClearable
              options={assigneeOptions}
              name='assignedTo'
              placeholder="Select assignees"
              value={createTaskForm.values.assignedTo}
              onChange={(option) => createTaskForm.setFieldValue('assignedTo', option)}
              onBlur={createTaskForm.handleBlur}
            />
            <p className="helper-text opacity-5">
              {createTaskForm.touched.assignedTo && createTaskForm.errors.assignedTo ? createTaskForm.errors.assignedTo : ''}
            </p>
          </div>
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
              onBlur={createTaskForm.handleBlur}
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
              onBlur={createTaskForm.handleBlur}
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
              onBlur={createTaskForm.handleBlur}
            />
            <p className="helper-text opacity-5">
              {createTaskForm.touched.level && createTaskForm.errors.level ? createTaskForm.errors.level : ''}
            </p>
          </div>
          <div className="cta">
            <button className="pointer paper-1" onClick={handleGoBack}>Cancel</button>
            <button className="pointer paper-1" type='submit'>Create</button>
          </div>
        </form>
      </section>
    </section>
  )
}

export default CreateTask