import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'

import organizationApi from '../../api/modules/organization.api'

import { setOrganization } from '../../redux/features/organizationSlice'

const CreateOrganization = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const createOrganizationForm = useFormik({
    initialValues: {
      name: ''
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required('Organization name is required')
        .min(2, 'Organization name must be at least 2 characters')
        .max(50, 'Organization name must be at most 50 characters')
    }),
    onSubmit: async ({ name }) => {
      const { res, err } = await organizationApi.create({ name })
      if (res && res.organization) {
        dispatch(setOrganization(res.organization))
        navigate('/dashboard')
        toast.success('Organization joined successfully!')
      }
      if (err) toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')
    }
  })

  return (
    <form className='paper' onSubmit={createOrganizationForm.handleSubmit}>
      <div className="input-field">
        <input
          className='paper-1'
          type='text'
          name='name'
          required
          placeholder='Enter organization name'
          value={createOrganizationForm.values.name}
          onChange={createOrganizationForm.handleChange}
          onBlur={createOrganizationForm.handleBlur}
        />
        <p className="helper-text opacity-5">
          {createOrganizationForm.touched.name && createOrganizationForm.errors.name ? createOrganizationForm.errors.name : ''}
        </p>
      </div>
      <button
        className='paper-1 pointer dark-btn'
        type='submit'
        disabled={createOrganizationForm.isSubmitting || !createOrganizationForm.isValid}
      >
        Create Organization
      </button>
    </form>
  )
}

export default CreateOrganization