import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Select from 'react-select'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { IoMdArrowBack } from 'react-icons/io'
import { MdOutlineCancel } from 'react-icons/md'
import { IoMdCreate } from 'react-icons/io'

import teamsApi from '../api/modules/teams.api'

import Menu from '../components/common/Menu'

import { setActive } from '../redux/features/menuSlice'
import { addTeam } from '../redux/features/teamsSlice'

import { menuIndices } from '../utils/menu.utils'

const CreateTeam = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { collapsed } = useSelector((state) => state.menu)
  const { developers, testers, membersMap } = useSelector((state) => state.organization)

  const [members, setMembers] = useState({ developers: [], testers: [] })
  const [teamLeadOptions, setTeamLeadOptions] = useState([])

  const handleGoBack = () => {
    navigate(-1)
  }

  const createTeamForm = useFormik({
    initialValues: {
      name: '',
      teamLead: null,
      developers: [],
      testers: [],
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required('Name is required')
        .min(3, 'Name must be at least 3 characters')
        .max(100, 'Name must be at most 100 characters'),
      teamLead: Yup.object()
        .required('Team lead is required'),
      developers: Yup.array().test(
        'at-least-one-member',
        'At least one developer or tester is required',
        function (value) {
          const { testers } = this.parent
          return (value?.length || 0) > 0 || (testers?.length || 0) > 0
        }
      ),
      testers: Yup.array().test(
        'at-least-one-member',
        'At least one developer or tester is required',
        function (value) {
          const { developers } = this.parent
          return (value?.length || 0) > 0 || (developers?.length || 0) > 0
        }
      ),
    }),
    onSubmit: async ({ name, teamLead, developers, testers }) => {
      const { res, err } = await teamsApi.create({
        name,
        teamLead: teamLead.value,
        developers: developers?.map((developer) => developer.value) || [],
        testers: testers?.map((tester) => tester.value) || [],
      })
      if (res) {
        dispatch(addTeam(res.team))
        toast.success('Team created successfully!')
        createTeamForm.resetForm()
      }
      if (err) toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')
    }
  })

  useEffect(() => {
    dispatch(setActive(menuIndices.teams))
  }, [])

  useEffect(() => {
    setMembers({
      developers: [...developers.map((developer) => ({ value: membersMap[developer].userId, label: membersMap[developer].name }))],
      testers: [...testers.map((tester) => ({ value: membersMap[tester].userId, label: membersMap[tester].name }))],
    })
  }, [developers, testers])

  useEffect(() => {
    const selectedMembers = new Set([
      ...createTeamForm.values.developers?.map((dev) => dev.value),
      ...createTeamForm.values.testers?.map((tester) => tester.value)
    ])
    setTeamLeadOptions([
      ...members.developers,
      ...members.testers
    ].filter((member) => !selectedMembers.has(member.value)))
  }, [members, createTeamForm.values.developers, createTeamForm.values.testers])

  return (
    <section id="create-team">
      <Menu />
      <section className={`content ${collapsed ? "expanded" : null}`} >
        <button className='go-back pointer paper-1' onClick={handleGoBack}>
          <IoMdArrowBack />
          <p>Go Back</p>
        </button>
        <form className="no-scrollbar" onSubmit={createTeamForm.handleSubmit}>
          <h1>Build a Team</h1>
          <div className="input-field">
            <input
              className='paper-1'
              type='text'
              name='name'
              required
              placeholder='Enter team name'
              value={createTeamForm.values.name}
              onChange={createTeamForm.handleChange}
              onBlur={createTeamForm.handleBlur}
            />
            <p className="helper-text opacity-5">
              {createTeamForm.touched.name && createTeamForm.errors.name ? createTeamForm.errors.name : ''}
            </p>
          </div>
          <div className="input-field">
            <Select
              className="paper-1 select"
              isSearchable
              isClearable
              options={teamLeadOptions}
              name='teamLead'
              placeholder="Select team lead"
              value={createTeamForm.values.teamLead}
              onChange={(option) => createTeamForm.setFieldValue('teamLead', option)}
              onBlur={() => createTeamForm.setFieldTouched('teamLead', true)}
            />
            <p className="helper-text opacity-5">
              {createTeamForm.touched.teamLead && createTeamForm.errors.teamLead ? createTeamForm.errors.teamLead : ''}
            </p>
          </div>
          <div className="input-field">
            <Select
              className="paper-1 select"
              isMulti
              isSearchable
              isClearable
              options={[
                ...members.developers.filter((developer) => {
                  if (createTeamForm.values.teamLead && createTeamForm.values.teamLead.value === developer.value) return false
                  return true
                })
              ]}
              name='developers'
              placeholder="Select developers"
              value={createTeamForm.values.developers}
              onChange={(option) => createTeamForm.setFieldValue('developers', option)}
              onBlur={() => createTeamForm.setFieldTouched('developers', true)}
            />
            <p className="helper-text opacity-5">
              {createTeamForm.touched.developers && createTeamForm.errors.developers ? createTeamForm.errors.developers : ''}
            </p>
          </div>
          <div className="input-field">
            <Select
              className="paper-1 select"
              isMulti
              isSearchable
              isClearable
              options={[
                ...members.testers.filter((developer) => {
                  if (createTeamForm.values.teamLead && createTeamForm.values.teamLead.value === developer.value) return false
                  return true
                })
              ]}
              name='testers'
              placeholder="Select testers"
              value={createTeamForm.values.testers}
              onChange={(option) => createTeamForm.setFieldValue('testers', option)}
              onBlur={() => createTeamForm.setFieldTouched('testers', true)}
            />
            <p className="helper-text opacity-5">
              {createTeamForm.touched.testers && createTeamForm.errors.testers ? createTeamForm.errors.testers : ''}
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
              disabled={createTeamForm.isSubmitting || !createTeamForm.isValid}
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

export default CreateTeam