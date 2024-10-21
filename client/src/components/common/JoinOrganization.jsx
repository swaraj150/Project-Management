import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Select from 'react-select'
import { toast } from 'react-toastify'
import { RxCross1 } from 'react-icons/rx'

import organizationApi from '../../api/modules/organization.api'

import { setOrganization } from '../../redux/features/organizationSlice'

import { joinableRoles } from '../../utils/organization.utils'

const JoinOrganization = ({ setJoinModalOpen, modalRef }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [tab, settab] = useState(0)
  const [options, setOptions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [code, setcode] = useState('')
  const [disabled, setDisabled] = useState(true)
  const [role, setrole] = useState(null)

  const handleSearch = async (inputValue) => {
    if (!inputValue) return

    setIsLoading(true)

    const { res, err } = await organizationApi.search({ query: inputValue })

    console.log(res, err)

    if (res) {
      const formattedOptions = res.data.map(org => ({
        label: org.name,
        value: org
      }))

      setOptions(formattedOptions)
      setIsLoading(false)
    }

    if (err) {
      setIsLoading(false)
      toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')
    }
  }

  const handleChange = (selected) => {
    setcode(selected.value.code)
  }

  const handleJoin = async () => {
    setDisabled(true)

    const { res, err } = await organizationApi.join({ code, role:role.value })

    if (res) {
      console.log(res)
      dispatch(setOrganization(res))
      setJoinModalOpen(false)
      // navigate('/')
      toast.success('Organization joined successfully!')
    }

    if (err) {
      setDisabled(false)
      toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')
    }
  }

  useEffect(() => {
    setcode('')
  }, [tab])

  useEffect(() => {
    setDisabled(!code.length === 0)
  }, [code])

  return (
    <div ref={modalRef} className="modal paper">
      <RxCross1 className="modal-close pointer" onClick={() => setJoinModalOpen(false)} />
      <div className="heading">
        <h2>Join Organization</h2>
        <div className="cta">
          <button className={`paper-1 pointer ${tab === 0 ? "active" : null}`} onClick={() => settab(0)}>Search</button>
          <button className={`paper-1 pointer ${tab === 1 ? "active" : null}`} onClick={() => settab(1)}>Code</button>
        </div>
      </div>
      {
        tab === 0 ? (
          <Select
            className="select paper-1"
            isLoading={isLoading}
            onInputChange={handleSearch}
            onChange={handleChange}
            options={options}
            placeholder="Search for an organization"
          />
        ) : (
          <input
            className='paper-1'
            type='text'
            name='code'
            required
            placeholder='Enter organization code'
            value={code}
            onChange={(e) => setcode(e.target.value)}
          />
        )
      }
      <Select
        className="select paper-1"
        isSearchable
        value={role}
        onChange={setrole}
        options={joinableRoles.map((role) => ({
          label: role,
          value: role
        }))}
        placeholder="Select your role"
      />
      <div className="cta-group">
        <button className="paper-1 pointer" onClick={() => setJoinModalOpen(false)}>Cancel</button>
        <button className="paper-1 pointer" onClick={handleJoin} disabled={disabled} >Join</button>
      </div>
    </div>
  )
}

export default JoinOrganization
