import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Select from 'react-select'
import { toast } from 'react-toastify'
import { IoMdAdd, IoMdArrowBack } from 'react-icons/io'
import { FaRegCalendarAlt, FaRupeeSign } from 'react-icons/fa'

import projectsApi from '../api/modules/projects.api'

import Menu from '../components/common/Menu'
import Team from '../components/common/Team'

import { useSelection } from '../contexts/SelectionContext'

import { setActive } from '../redux/features/menuSlice'
import { addTeamsToProject } from '../redux/features/projectsSlice'

import { menuIndices } from '../utils/menu.utils'
import { roles } from '../utils/organization.utils'
import { formatBudget, formatDate } from '../utils/project.utils'
import { headings, membersCount } from '../utils/team.utils'

const ProjectDetails = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.user)
  const { membersMap } = useSelector((state) => state.organization)
  const { teams, teamsMap } = useSelector((state) => state.teams)

  const { selectedProject } = useSelection()

  const { collapsed } = useSelector((state) => state.menu)
  const [options, setOptions] = useState([])
  const [teamOptions, setTeamOptions] = useState([])
  const [selectedTeams, setSelectedTeams] = useState([])
  const [addTeamsRequested, setAddTeamsRequested] = useState(false)

  const handleGoBack = () => {
    navigate(-1)
  }

  const handleAddTeams = async () => {
    setAddTeamsRequested(true)
    const teamIds = selectedTeams.map((team) => team.value)
    const { res, err } = await projectsApi.addTeams({ projectId: selectedProject.id, teams: teamIds })
    if (res) {
      dispatch(addTeamsToProject({ teams: teamIds, id: selectedProject.id }))
      toast.success('Teams added successfully')
      setSelectedTeams([])
    }
    if (err) toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')
    setAddTeamsRequested(false)
  }

  useEffect(() => {
    dispatch(setActive(menuIndices.projects))
  }, [])

  useEffect(() => {
    if (!selectedProject) handleGoBack()
  }, [selectedProject])

  useEffect(() => {
    if (!selectedProject) handleGoBack()
  }, [selectedProject])

  useEffect(() => {
    setOptions([...teams].map((team) => ({ value: team, label: teamsMap[team].name })))
  }, [teams])

  useEffect(() => {
    const allocatedTeams = new Set([...selectedProject.teams])
    setTeamOptions([...options].filter((option) => !allocatedTeams.has(option.value)))
  }, [options, selectedProject?.teams])

  return (
    <section id="project-details">
      <Menu />
      <section className={`content no-scrollbar ${collapsed ? "expanded" : null}`} >
        {
          user.projectRole === roles.productOwner ? (
            <button className='go-back pointer paper-1' onClick={handleGoBack}>
              <IoMdArrowBack />
              <p>Go Back</p>
            </button>
          ) : null
        }
        {
          selectedProject && (
            <div className={`information ${user.projectRole !== roles.productOwner ? 'no-back' : null}`}>
              <h2>{selectedProject.title}</h2>
              <p>{selectedProject.description}</p>
              <div className="date">
                <FaRegCalendarAlt />
                {formatDate(selectedProject.startDate)} - {selectedProject.endDate ? formatDate(selectedProject.endDate) : formatDate(selectedProject.estimatedEndDate)}
              </div>
              <div className="budget">
                <FaRupeeSign />
                {formatBudget(selectedProject.budget)}
              </div>
              <div className="project-manager">
                <p className='opacity-7'>Project Manager</p>
                <div className="project-manager-details">
                  <img className='profile-img' src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" alt="" />
                  <h4>{membersMap[selectedProject.projectManager].name}</h4>
                  <a href={`mailto:${membersMap[selectedProject.projectManager].emails[0]}`} className="opacity-7" >
                    {membersMap[selectedProject.projectManager].emails[0]}
                  </a>
                </div>
              </div>
              <div className="teams">
                <p>Teams ({selectedProject.teams.length})</p>
                {
                  user.projectRole === roles.productOwner || user.projectRole === roles.projectManager ? (
                    <div className="cta">
                      <Select
                        className="select paper-1"
                        isMulti
                        isSearchable
                        isClearable
                        value={selectedTeams}
                        onChange={setSelectedTeams}
                        options={teamOptions}
                        placeholder="Select teams to add"
                      />
                      <button
                        className="pointer paper-1 dark-btn"
                        disabled={addTeamsRequested || selectedTeams.length === 0}
                        onClick={handleAddTeams}
                      >
                        <IoMdAdd />
                        <p>Add Teams</p>
                      </button>
                    </div>
                  ) : null
                }
                {
                  selectedProject.teams.length > 0 && <div className="teams-list">
                    <div className="teams-list-headings paper-1">
                      {
                        headings.map((heading, index) => (
                          <p key={index} >{heading}</p>
                        ))
                      }
                    </div>
                    <ul className="teams-list-items no-scrollbar">
                      {
                        selectedProject.teams.map((team, index) => (
                          <Team key={index} team={teamsMap[team]} />
                        ))
                      }
                    </ul>
                  </div>
                }
              </div>
              <Link className='tasks' to='/tasks'>View Tasks</Link>
            </div>
          )
        }
      </section>
    </section>
  )
}

export default ProjectDetails