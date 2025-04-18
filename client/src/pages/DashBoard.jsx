import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector, useStore } from 'react-redux'
import Select from 'react-select'

import metricApi from '../api/modules/metrics.api'

import Menu from '../components/common/Menu'
import ProjectExpertise from '../components/common/TeamExpertise'
import ProjectWorkload from '../components/common/ProjectWorkload'
import StatusDistribution from '../components/common/StatusDistribution'
import PriorityDistribution from '../components/common/PriorityDistribution'
import OrganizationWorkload from '../components/common/OrganizationWorkload'

import { useSelection } from '../contexts/SelectionContext'

import { setActive } from '../redux/features/menuSlice'

import { menuIndices } from '../utils/menu.utils'
import OrganizationExpertise from '../components/common/OrganizationExpertise'

import { roles } from '../utils/organization.utils'

const Dashboard = () => {
  const dispatch = useDispatch()

  const { collapsed } = useSelector((state) => state.menu)
  const { user } = useSelector((state) => state.user)
  const { teamsMap } = useSelector((state) => state.teams)
  const { projects, projectsMap } = useSelector((state) => state.projects)

  const { selectedTeam, setSelectedTeam, selectedProject, setSelectedProject } = useSelection()

  const [view, setview] = useState(0)

  useEffect(() => {
    dispatch(setActive(menuIndices.dashboard))
  }, [])

  useEffect(() => {

  }, [user])

  useEffect(() => {
    const loadedMetrics = {}

    const fetchProjectWorkload = async () => {
      const { res, err } = await metricApi.projectWorkload({ projectId: selectedProject.id })
      if (res) loadedMetrics['projectWorkload'] = res.workload
      if (err) toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')
    }

    const fetchProjectExpertise = async () => {
      const { res, err } = await metricApi.projectExpertise({ projectId: selectedProject.id })
      if (res) loadedMetrics['projectExpertise'] = res.expertise
      if (err) toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')
    }

    const fetchProjectStatus = async () => {
      const { res, err } = await metricApi.projectStatus({ projectId: selectedProject.id })
      if (res) loadedMetrics['projectStatus'] = res.status
      if (err) toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')
    }

    const fetchProjectSummary = async () => {
      const { res, err } = await metricApi.projectSummary({ projectId: selectedProject.id })
      if (res) loadedMetrics['projectSummary'] = res.priority
      if (err) toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')
    }

    const fetchProjectMetrics = async () => {
      await Promise.all([fetchProjectWorkload, fetchProjectExpertise, fetchProjectStatus, fetchProjectSummary])
    }

    const fetchTeamExpertise = async () => {
      const { res, err } = await metricApi.teamExpertise({ projectId: selectedProject.id, teamId: selectedTeam.id })
      if (res) loadedMetrics['teamExpertise'] = res.expertise
      if (err) toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')
    }
  }, [])

  return (
    <section id="dashboard">
      <Menu />
      <section className={`content ${collapsed ? "expanded" : null}`} >
        {/* <div className="select-options">
          <Select
            className="paper-1 select"
            isSearchable
            isClearable
            options={projects.map((project) => ({ value: project, label: projectsMap[project].title }))}
            name='project'
            placeholder="Select project"
            value={selectedProject}
            onChange={setSelectedProject}
          />
          {
            selectedProject &&
            <Select
              className="paper-1 select"
              isSearchable
              isClearable
              options={projectTeams[selectedProject.value].map((team) => ({ value: team, label: teamsMap[team].name }))}
              team
              placeholder="Select team"
              value={selectedTeam}
              onChange={setSelectedTeam}
            />
          }
        </div> */}
        <div className="chart-options">
          {user.projectRole === roles.productOwner ? (
            <button
              className={`pointer paper-1 ${view === 0 ? 'dark-btn' : null}`}
              onClick={() => setview(0)}
            >
              Organization
            </button>
          ) : null}
          <button
            className={`pointer paper-1 ${view === 1 ? 'dark-btn' : null}`}
            onClick={() => setview(1)}
          >
            Project
          </button>
          <button
            className={`pointer paper-1 ${view === 2 ? 'dark-btn' : null}`}
            onClick={() => setview(2)}
          >
            Team
          </button>
        </div>
        <div className="charts no-scrollbar">
          <OrganizationWorkload />
          <OrganizationExpertise />
        </div>
      </section>
    </section>
  )
}

export default Dashboard
