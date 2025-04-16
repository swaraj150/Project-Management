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

import projectsApi from '../api/modules/projects.api'

import Menu from '../components/common/Menu'

import { setActive } from '../redux/features/menuSlice'
import { addProject } from '../redux/features/projectsSlice'

import { menuIndices } from '../utils/menu.utils'
import { technologyLabels } from '../utils/project.utils'

const CreateProject = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { collapsed } = useSelector((state) => state.menu)
  const { managers, membersMap } = useSelector((state) => state.organization)

  const startDateRef = useRef(null)

  const [startDateType, setStartDateType] = useState('text')
  const [managerOptions, setManagerOptions] = useState([])

  const handleGoBack = () => {
    navigate(-1)
  }

  const createProjectForm = useFormik({
    initialValues: {
      title: '',
      description: '',
      manager: null,
      technologies: [],
      estimatedEndDate: '',
      budget: ''
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .required('Title is required')
        .min(3, 'Title must be at least 3 characters')
        .max(100, 'Title must be at most 100 characters'),
      description: Yup.string()
        .required('Description is required')
        .max(500, 'Description must be at most 500 characters'),
      manager: Yup.object()
        .required('Project manager is required'),
      technologies: Yup.array(),
      estimatedEndDate: Yup.string()
        .required('Estimated end date is required')
        .test('future-date', 'Estimated end date must be in the future', (value) => {
          return new Date(value) > new Date();
        }),
      budget: Yup.number()
        .required('Budget is required')
        .moreThan(0, 'Budget must be greater than 0')
    }),
    onSubmit: async ({ title, description, manager, technologies, estimatedEndDate, budget }) => {
      const { res, err } = await projectsApi.create({
        title,
        description,
        projectManagerId: manager.value,
        technologies: technologies.map((technology) => technology.value),
        estimatedEndDate,
        budget
      })
      if (res && res.project) {
        dispatch(addProject(res.project))
        toast.success('Project created successfully!')
        createProjectForm.resetForm()
        setStartDateType('text')
      }
      if (err) toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')
    }
  })

  useEffect(() => {
    dispatch(setActive(menuIndices.projects))
  }, [])

  useEffect(() => {
    setManagerOptions(managers.map((manager) => ({
      value: manager,
      label: membersMap[manager].name
    })))
  }, [managers])

  useEffect(() => {
    if (startDateType === 'date' && startDateRef.current) {
      startDateRef.current.showPicker?.()
    }
  }, [startDateType])

  return (
    <section id="create-project">
      <Menu />
      <section className={`content ${collapsed ? "expanded" : null}`} >
        <button className='go-back pointer paper-1' onClick={handleGoBack}>
          <IoMdArrowBack />
          <p>Go Back</p>
        </button>
        <form className="no-scrollbar" onSubmit={createProjectForm.handleSubmit}>
          <h2>Create new project</h2>
          <div className="input-field">
            <input
              className='paper-1'
              type='text'
              name='title'
              required
              placeholder='Enter project title'
              value={createProjectForm.values.title}
              onChange={createProjectForm.handleChange}
              onBlur={createProjectForm.handleBlur}
            />
            <p className="helper-text opacity-5">
              {createProjectForm.touched.title && createProjectForm.errors.title ? createProjectForm.errors.title : ''}
            </p>
          </div>
          <div className="input-field">
            <textarea
              className='paper-1 no-scrollbar'
              rows={1}
              name='description'
              required
              placeholder='Enter project description'
              value={createProjectForm.values.description}
              onChange={createProjectForm.handleChange}
              onBlur={createProjectForm.handleBlur}
            />
            <p className="helper-text opacity-5">
              {createProjectForm.touched.description && createProjectForm.errors.description ? createProjectForm.errors.description : ''}
            </p>
          </div>
          <div className="input-field">
            <Select
              className="paper-1 select"
              isSearchable
              isClearable
              options={managerOptions}
              name='manager'
              placeholder="Select project manager"
              value={createProjectForm.values.manager}
              onChange={(option) => createProjectForm.setFieldValue('manager', option)}
              onBlur={() => createProjectForm.setFieldTouched('manager', true)}
            />
            <p className="helper-text opacity-5">
              {createProjectForm.touched.manager && createProjectForm.errors.manager ? createProjectForm.errors.manager : ''}
            </p>
          </div>
          <div className="input-field">
            <Select
              className="paper-1 select"
              isMulti
              isSearchable
              isClearable
              options={technologyLabels}
              name='technologies'
              placeholder="Select technologies"
              value={createProjectForm.values.technologies}
              onChange={(option) => createProjectForm.setFieldValue('technologies', option)}
              onBlur={() => createProjectForm.setFieldTouched('technologies', true)}
            />
            <p className="helper-text opacity-5">
              {createProjectForm.touched.technologies && createProjectForm.errors.technologies ? createProjectForm.errors.technologies : ''}
            </p>
          </div>
          <div className="input-field">
            <input
              ref={startDateRef}
              className='paper-1'
              type={startDateType}
              name='estimatedEndDate'
              required
              placeholder='Enter estimated end date'
              value={createProjectForm.values.estimatedEndDate}
              onChange={createProjectForm.handleChange}
              onBlur={(e) => {
                createProjectForm.handleBlur(e)
                if (!createTaskForm.values.startDate) setStartDateType('text')
              }}
              onFocus={() => setStartDateType('date')}
            />
            <p className="helper-text opacity-5">
              {createProjectForm.touched.estimatedEndDate && createProjectForm.errors.estimatedEndDate ? createProjectForm.errors.estimatedEndDate : ''}
            </p>
          </div>
          <div className="input-field">
            <input
              className='paper-1'
              type='number'
              min={0}
              name='budget'
              required
              placeholder='Enter budget'
              value={createProjectForm.values.budget}
              onChange={createProjectForm.handleChange}
              onBlur={createProjectForm.handleBlur}
            />
            <p className="helper-text opacity-5">
              {createProjectForm.touched.budget && createProjectForm.errors.budget ? createProjectForm.errors.budget : ''}
            </p>
          </div>
          <div className="cta">
            <button className="pointer paper-1" type='button' onClick={handleGoBack}>
              <MdOutlineCancel />
              Cancel
            </button>
            <button
              className="dark-btn pointer paper-1"
              type='submit'
              disabled={createProjectForm.isSubmitting || !createProjectForm.isValid}
            >
              <IoMdCreate />
              Create
            </button>
          </div>
        </form>
      </section>
    </section>
  )
}

export default CreateProject