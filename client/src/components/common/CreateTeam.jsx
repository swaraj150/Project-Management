import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Select from 'react-select'
import { toast } from 'react-toastify'
import { RxCross1 } from 'react-icons/rx'

import teamsApi from '../../api/modules/teams.api'

import { addTeam } from '../../redux/features/teamsSlice'

import { roles } from '../../utils/organization.utils'

const CreateTeam = ({ setModalOpen, modalRef }) => {
  const dispatch = useDispatch()
  const { organization } = useSelector((state) => state.organization)

  const [name, setName] = useState('')
  const [developers, setDevelopers] = useState([])
  const [testers, setTesters] = useState([])
  const [teamLead, setTeamLead] = useState(null)
  const [options, setOptions] = useState([])
  const [disabled, setDisabled] = useState(true)

  useEffect(() => {
    setOptions(organization.members.map((member) => ({
      value: member,
      label: member.name
    })))
  }, [organization])

  useEffect(() => {
    setDisabled(!(name && (developers.length > 0 || testers.length > 0) && teamLead))
  }, [name, developers, testers, teamLead])

  const handleCreate = async () => {
    setDisabled(true)

    const { res, err } = await teamsApi.create({
      name,
      developers: developers.map((dev) => dev.value),
      testers: testers.map((tester) => tester.value),
      teamLead: teamLead.value,
    })

    if (res) {
      dispatch(addTeam(res))
      setModalOpen(false)
      toast.success('Team created successfully!')
    }

    if (err) {
      toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')
      setDisabled(false)
    }
  }

  const getFilteredOptions = (role) => {
    const filteredOptions = options.filter(option => {
      const memberId = option.value.userId

      if (teamLead && memberId === teamLead.value.userId) {
        return false
      }

      if (role === roles.developer) {
        return !testers.some(tester => tester.value.userId === memberId)
      }
      
      if (role === roles.qa) {
        return !developers.some(dev => dev.value.userId === memberId)
      }

      if (role === roles.teamLead) {
        return !developers.some(dev => dev.value.userId === memberId) &&
          !testers.some(tester => tester.value.userId === memberId)
      }

      return true
    })

    return filteredOptions
  }

  return (
    <div ref={modalRef} className="modal paper">
      <RxCross1 className="modal-close pointer" onClick={() => setModalOpen(false)} />
      <h2>Build a Team</h2>
      <input
        className='paper-1'
        type='text'
        name='name'
        required
        placeholder='Enter team name'
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Select
        className="paper-1 select"
        isSearchable
        value={teamLead}
        onChange={setTeamLead}
        options={getFilteredOptions(roles.teamLead)}
        placeholder="Select team lead"
        innerRef={modalRef}
      />
      <Select
        className="paper-1 select"
        isMulti
        isSearchable
        value={developers}
        onChange={setDevelopers}
        options={getFilteredOptions(roles.developer)}
        placeholder="Select developers"
        innerRef={modalRef}
      />
      <Select
        className="paper-1 select"
        isMulti
        isSearchable
        value={testers}
        onChange={setTesters}
        options={getFilteredOptions(roles.qa)}
        placeholder="Select testers"
        innerRef={modalRef}
      />
      <div className="cta">
        <button className="pointer paper-1" onClick={() => setModalOpen(false)}>Cancel</button>
        <button className="pointer paper-1" onClick={handleCreate} disabled={disabled}>Create</button>
      </div>
    </div>
  )
}

export default CreateTeam