import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Select from 'react-select'
import { toast } from 'react-toastify'
import { RxCross1 } from 'react-icons/rx'

import projectsAPi from '../../api/modules/projects.api'

import { addTeam } from '../../redux/features/teamsSlice'

const AddTeam = ({ project, setAddTeamModalOpen, modalRef }) => {
  const dispatch = useDispatch()

  const { teams } = useSelector((state) => state.teams)

  const [options, setOptions] = useState([])
  const [selectedTeams, setSelectedTeams] = useState([])
  const [disabled, setDisabled] = useState(true)

  useEffect(() => {
    setOptions(teams
      .filter((team) => !project.teams.includes(team.id))
      .map((team) => ({
        value: team.id,
        label: team.name
      })))
  }, [teams])

  useEffect(() => {
    setDisabled(!selectedTeams.length > 0)
  }, [selectedTeams])

  const handleAdd = async () => {
    setDisabled(true)

    const { res, err } = await projectsAPi.addTeam({
      projectId: project.id,
      teams: selectedTeams.map((selectedTeam) => selectedTeam.value)
    })

    if (res) {
      dispatch(addTeam(res))
      setAddTeamModalOpen(false)
      toast.success('Team added successfully!')
    }

    if (err) {
      toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')
      setDisabled(false)
    }
  }

  return (
    <div ref={modalRef} className="modal sub-modal paper">
      <RxCross1 className="modal-close pointer" onClick={() => setAddTeamModalOpen(false)} />
      <h2>Add Team</h2>
      <Select
        className="select paper-1"
        isMulti
        isSearchable
        value={selectedTeams}
        onChange={setSelectedTeams}
        options={options}
        placeholder="Select teams to add"
        innerRef={modalRef}
      />
      <div className="cta">
        <button className="pointer paper-1" onClick={() => setAddTeamModalOpen(false)}>Cancel</button>
        <button className="pointer paper-1" onClick={handleAdd} disabled={disabled} >Add</button>
      </div>
    </div>
  )
}

export default AddTeam