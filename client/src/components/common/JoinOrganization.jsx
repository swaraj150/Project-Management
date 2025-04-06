import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Select from 'react-select'
import { toast } from 'react-toastify'

import organizationApi from '../../api/modules/organization.api'
import { joinableRoles } from '../../utils/organization.utils'

const JoinOrganization = () => {
  const [options, setOptions] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const joinOrganizationForm = useFormik({
    initialValues: {
      searchQuery: null,
      code: '',
      role: null
    },
    validationSchema: Yup.object({
      searchQuery: Yup.object().nullable(),
      code: Yup.string().required('Code is required'),
      role: Yup.object().required('Role is required')
    }),
    onSubmit: async ({ code, role }) => {
      const { res, err } = await organizationApi.join({ code, role: role.value })
      if (res) {
        toast.success('Request sent successfully!')
        joinOrganizationForm.resetForm()
        setOptions([])
      }
      if (err) toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')
    }
  })

  const handleSearch = async (value) => {
    if (!value || value.trim() === '') {
      setOptions([])
      return
    }

    setIsLoading(true)

    const { res, err } = await organizationApi.search({ query: value })

    if (res && res.organizations) {
      const formattedOptions = res.organizations.map(org => ({
        label: String(org.name || 'Unknown'),
        value: String(org.code || '')
      }))
      setOptions(formattedOptions)
    }
    if (err) {
      toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')
      setOptions([])
    }
    setIsLoading(false)
  }

  const handleChange = (option) => {
    joinOrganizationForm.setFieldValue('searchQuery', option)
    joinOrganizationForm.setFieldValue('code', option?.value || '')
  }

  return (
    <form className='paper' onSubmit={joinOrganizationForm.handleSubmit}>
      <div className="input-filed">
        <Select
          className='select paper-1'
          isClearable
          isLoading={isLoading}
          options={options}
          name='searchQuery'
          placeholder='Search for an organization'
          value={joinOrganizationForm.values.searchQuery}
          onInputChange={(newValue) => {
            if (newValue) handleSearch(newValue)
            return newValue
          }}
          onChange={handleChange}
          onBlur={joinOrganizationForm.handleBlur}
        />
        <p className="helper-text opacity-5">
          {joinOrganizationForm.touched.searchQuery && joinOrganizationForm.errors.searchQuery ? joinOrganizationForm.errors.searchQuery : ''}
        </p>
      </div>
      <div className="input-field">
        <input
          className='paper-1'
          type='text'
          name='code'
          required
          placeholder='Enter organization code'
          value={joinOrganizationForm.values.code}
          onChange={joinOrganizationForm.handleChange}
          onBlur={joinOrganizationForm.handleBlur}
        />
        <p className="helper-text opacity-5">
          {joinOrganizationForm.touched.code && joinOrganizationForm.errors.code ? joinOrganizationForm.errors.code : ''}
        </p>
      </div>
      <div className="input-field">
        <Select
          className='select paper-1'
          isSearchable
          isClearable
          options={joinableRoles}
          name='role'
          placeholder='Select your role'
          value={joinOrganizationForm.values.role}
          onChange={(option) => joinOrganizationForm.setFieldValue('role', option)}
          onBlur={joinOrganizationForm.handleBlur}
        />
        <p className="helper-text opacity-5">
          {joinOrganizationForm.touched.role && joinOrganizationForm.errors.role ? joinOrganizationForm.errors.role : ''}
        </p>
      </div>
      <button
        className='paper-1 pointer dark-btn'
        type='submit'
        disabled={joinOrganizationForm.isSubmitting || !joinOrganizationForm.isValid}
      >
        Join Organization
      </button>
    </form>
  )
}

export default JoinOrganization