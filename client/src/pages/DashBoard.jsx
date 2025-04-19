import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector, useStore } from 'react-redux'
import Select from 'react-select'

import Menu from '../components/common/Menu'
import OrganizationStatus from '../components/common/OrganizationStatus'
import OrganizationSummary from '../components/common/OrganizationSummary'
import OrganizationWorkload from '../components/common/OrganizationWorkload'
import OrganizationExpertise from '../components/common/OrganizationExpertise'
import ProjectStatus from '../components/common/ProjectStatus'
import ProjectWorkload from '../components/common/ProjectWorkload'
import ProjectExpertise from '../components/common/ProjectExpertise'
import TeamExpertise from '../components/common/TeamExpertise'

import { useSelection } from '../contexts/SelectionContext'

import { setActive } from '../redux/features/menuSlice'

import { menuIndices } from '../utils/menu.utils'

import { roles } from '../utils/organization.utils'

const Dashboard = () => {
  const dispatch = useDispatch()

  const { collapsed } = useSelector((state) => state.menu)
  const { user } = useSelector((state) => state.user)
  const { teamsMap } = useSelector((state) => state.teams)
  const { projects, projectsMap } = useSelector((state) => state.projects)

  const { selectedTeam, setSelectedTeam, selectedProject, setSelectedProject } = useSelection()

  const [levelOption, setlevelOption] = useState(0)
  const [chartOption, setChartOption] = useState(0)

  useEffect(() => {
    dispatch(setActive(menuIndices.dashboard))
  }, [])

  useEffect(() => {
    if (user.projectRole !== roles.productOwner) {
      setlevelOption(1)
      if (projectsMap) setSelectedProject(projectsMap[projects[0]])
      console.log(projectsMap)
    }
  }, [user, projectsMap])

  useEffect(() => {
    setChartOption(0)
  }, [levelOption])

  const chartOptions = () => {
    if (levelOption === 0) {
      return (
        <div className="chart-options">
          <button
            className={`pointer paper-1 ${chartOption === 0 ? 'dark-btn' : null}`}
            onClick={() => setChartOption(0)}
          >
            Status
          </button>
          <button
            className={`pointer paper-1 ${chartOption === 1 ? 'dark-btn' : null}`}
            onClick={() => setChartOption(1)}
          >
            Summary
          </button>
          <button
            className={`pointer paper-1 ${chartOption === 2 ? 'dark-btn' : null}`}
            onClick={() => setChartOption(2)}
          >
            Workload
          </button >
          <button
            className={`pointer paper-1 ${chartOption === 3 ? 'dark-btn' : null}`}
            onClick={() => setChartOption(3)}
          >
            Expertise
          </button>
        </div>
      )
    } else if (levelOption === 1) {
      return (
        <div className="chart-options">
          <button
            className={`pointer paper-1 ${chartOption === 0 ? 'dark-btn' : null}`}
            onClick={() => setChartOption(0)}
          >
            Status
          </button>
          <button
            className={`pointer paper-1 ${chartOption === 1 ? 'dark-btn' : null}`}
            onClick={() => setChartOption(1)}
          >
            Workload
          </button >
          <button
            className={`pointer paper-1 ${chartOption === 2 ? 'dark-btn' : null}`}
            onClick={() => setChartOption(2)}
          >
            Expertise
          </button>
        </div>
      )
    }
  }

  const levelOptions = () => {
    return (
      <div className='level-options'>
        {
          user.projectRole === roles.productOwner ? (
            <button
              className={`pointer paper-1 ${levelOption === 0 ? 'dark-btn' : null}`}
              onClick={() => setlevelOption(0)}
            >
              Organization
            </button>
          ) : null
        }
        <button
          className={`pointer paper-1 ${levelOption === 1 ? 'dark-btn' : null}`}
          onClick={() => setlevelOption(1)}
        >
          Project
        </button >
        <button
          className={`pointer paper-1 ${levelOption === 2 ? 'dark-btn' : null}`}
          onClick={() => setlevelOption(2)}
        >
          Team
        </button>
      </div >
    )
  }

  return (
    <section id="dashboard">
      <Menu />
      <section className={`content ${collapsed ? "expanded" : null}`} >
        <div className="chart-context">
          <div className="select-entities">
            {user.projectRole === roles.productOwner && (levelOption === 1 || levelOption === 2) && (
              <Select
                className="paper-1 select"
                isSearchable
                isClearable
                options={projects.map((project) => ({ value: project, label: projectsMap[project].title }))}
                name='project'
                placeholder="Select project"
                value={selectedProject ? { value: selectedProject.id, label: selectedProject.title } : null}
                onChange={(option) => setSelectedProject(option ? projectsMap[option.value] : null)}
              />
            )}
            {selectedProject && levelOption === 2 && (
              <Select
                className="paper-1 select"
                isSearchable
                isClearable
                options={selectedProject.teams.map((team) => ({ value: team, label: teamsMap[team].name }))}
                name='project'
                placeholder="Select team"
                value={selectedTeam ? { value: selectedTeam.id, label: selectedTeam.name } : null}
                onChange={(option) => setSelectedTeam(option ? teamsMap[option.value] : null)}
              />
            )}
          </div>
          <div className="options">
            {levelOptions()}
            {chartOptions()}
          </div>
        </div>
        <div className="charts no-scrollbar">
          {levelOption === 0 && chartOption === 0 && <OrganizationStatus />}
          {levelOption === 0 && chartOption === 1 && <OrganizationSummary />}
          {levelOption === 0 && chartOption === 2 && <OrganizationWorkload />}
          {levelOption === 0 && chartOption === 3 && <OrganizationExpertise />}
          {selectedProject && levelOption === 1 && chartOption === 0 && <ProjectStatus projectId={selectedProject.id} />}
          {selectedProject && levelOption === 1 && chartOption === 1 && <ProjectWorkload projectId={selectedProject.id} />}
          {selectedProject && levelOption === 1 && chartOption === 2 && <ProjectExpertise projectId={selectedProject.id} />}
          {selectedProject && selectedTeam && levelOption === 2 && <TeamExpertise projectId={selectedProject.id} teamId={selectedTeam.id} />}
          {!selectedProject && [1,2].includes(levelOption) && <p>Select project to view charts</p>}
          {selectedProject && !selectedTeam && levelOption === 2 && <p>Select team to view charts</p>}
        </div>
      </section>
    </section>
  )
}

export default Dashboard
