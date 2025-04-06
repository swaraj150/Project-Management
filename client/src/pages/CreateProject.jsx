import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Select from 'react-select'
import { IoMdArrowBack } from 'react-icons/io'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'

import projectsApi from '../api/modules/projects.api'

import Menu from '../components/common/Menu'

import { setActive } from '../redux/features/menuSlice'
import { addProject } from '../redux/features/projectsSlice'

import { menuIndices } from '../utils/menu.utils'
import { setInputType } from '../utils/input.utils'

const CreateProject = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { collapsed } = useSelector((state) => state.menu)
  const { managers, membersMap } = useSelector((state) => state.organization)

  const [managerOptions, setManagerOptions] = useState([])

  const handleGoBack = () => {
    navigate(-1)
  }

  useEffect(() => {
    dispatch(setActive(menuIndices.projects))
  }, [])

  useEffect(() => {
    setManagerOptions(managers.map((manager) => ({
      value: manager,
      label: membersMap[manager].name
    })))
  }, [managers])


  const createProjectForm = useFormik({
    initialValues: {
      title: '',
      description: '',
      manager: null,
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
      estimatedEndDate: Yup.string()
        .required('Estimated end date is required')
        .test('future-date', 'Estimated end date must be in the future', (value) => {
          return new Date(value) > new Date();
        }),
      budget: Yup.number()
        .required('Budget is required')
        .moreThan(0, 'Budget must be greater than 0')
    }),
    onSubmit: async ({ title, description, estimatedEndDate, budget, manager }) => {
      const { res, err } = await projectsApi.create({ title, description, estimatedEndDate, budget, projectManagerId: manager.value })
      if (res && res.project) {
        dispatch(addProject(res.project))
        toast.success('Project created successfully!')
        createProjectForm.resetForm()
      }
      if (err) toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')
    }
  })

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
              type='textarea'
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
              onBlur={createProjectForm.handleBlur}
            />
            <p className="helper-text opacity-5">
              {createProjectForm.touched.manager && createProjectForm.errors.manager ? createProjectForm.errors.manager : ''}
            </p>
          </div>
          <div className="input-field">
            <input
              className='paper-1'
              type='text'
              name='estimatedEndDate'
              required
              placeholder='Enter estimated end date'
              value={createProjectForm.values.estimatedEndDate}
              onChange={createProjectForm.handleChange}
              onBlur={(e) => {
                if (!e.target.value) setInputType({ e, newType: 'text' })
              }}
              onFocus={(e) => setInputType({ e, newType: 'date' })}
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
            <button className="pointer paper-1" onClick={handleGoBack}>Cancel</button>
            <button className="pointer paper-1" type='submit'>Create</button>
          </div>
        </form>
      </section>
    </section>
  )
}

export default CreateProject