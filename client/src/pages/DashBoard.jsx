import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Select from 'react-select'

import Menu from '../components/common/Menu'
import ProjectExpertise from '../components/common/TeamExpertise'
import ProjectWorkload from '../components/common/ProjectWorkload'

import { setActive } from '../redux/features/menuSlice'

import { menuIndices } from '../utils/menu.utils'
import StatusDistribution from '../components/common/StatusDistribution'
import PriorityDistribution from '../components/common/PriorityDistribution'

const projectTeams = {
  '9044ba17-8e4c-40be-87ad-a9f0424cec74': [
    '5d5d95db-8179-45f3-87ac-16c308c63405',
    'eb4cf705-cd7d-41a0-9556-f833623f9027',
    '50a3a4b1-8461-425b-a0e5-8836f47b6287',
    '80e69aa0-5292-4bf6-964b-1f7e744f6dc1',
    'a7358f85-7a82-45e5-bb4c-abbcae2433bf'
  ],
  '2af03917-662c-4d55-9953-0f3b60e93a42': [
    '44a1dec4-d063-4502-b181-e1f169df4627',
    '5a21fe1c-1a3f-4238-9323-939c2d381b04',
    '2b4e29e2-bf11-4339-8222-bda126503cbe',
    'ceffd358-dff8-4c13-9c88-7d85a8107ee7',
    '93fa0031-0323-4fe4-a162-f490ab9b6e8d'
  ],
  'b69fb7bf-9929-4acb-af12-5974aaeebb70': [
    '99719c09-8138-4c27-b2e4-7e941a14953f',
    '39bee551-8449-45f7-9f7d-abda6836a740',
    '1a3b8dd5-fb0d-4b2f-9d7c-4bc71bc45bb0',
    'b1160032-5181-4951-a46b-891e9568247c',
    '5b7c4b45-2bb9-47d8-84bb-5902b1cf81e0'
  ]
}

const workloads = {
  '9044ba17-8e4c-40be-87ad-a9f0424cec74': {
    '5d5d95db-8179-45f3-87ac-16c308c63405': 30,
    'eb4cf705-cd7d-41a0-9556-f833623f9027': 28,
    '50a3a4b1-8461-425b-a0e5-8836f47b6287': 25,
    '80e69aa0-5292-4bf6-964b-1f7e744f6dc1': 10,
    'a7358f85-7a82-45e5-bb4c-abbcae2433bf': 12
  },
  '2af03917-662c-4d55-9953-0f3b60e93a42': {
    '44a1dec4-d063-4502-b181-e1f169df4627': 15,
    '5a21fe1c-1a3f-4238-9323-939c2d381b04': 25,
    '2b4e29e2-bf11-4339-8222-bda126503cbe': 19,
    'ceffd358-dff8-4c13-9c88-7d85a8107ee7': 30,
    '93fa0031-0323-4fe4-a162-f490ab9b6e8d': 25
  },
  'b69fb7bf-9929-4acb-af12-5974aaeebb70': {
    '99719c09-8138-4c27-b2e4-7e941a14953f': 19,
    '39bee551-8449-45f7-9f7d-abda6836a740': 10,
    '1a3b8dd5-fb0d-4b2f-9d7c-4bc71bc45bb0': 20,
    'b1160032-5181-4951-a46b-891e9568247c': 6,
    '5b7c4b45-2bb9-47d8-84bb-5902b1cf81e0': 16
  }
}

const expertiseDistribution = {
  '9044ba17-8e4c-40be-87ad-a9f0424cec74': {
    '5d5d95db-8179-45f3-87ac-16c308c63405': { beginner: 30, intermediate: 30, expert: 40 },
    'eb4cf705-cd7d-41a0-9556-f833623f9027': { beginner: 30, intermediate: 40, expert: 30 },
    '50a3a4b1-8461-425b-a0e5-8836f47b6287': { beginner: 20, intermediate: 40, expert: 40 },
    '80e69aa0-5292-4bf6-964b-1f7e744f6dc1': { beginner: 25, intermediate: 50, expert: 25 },
    'a7358f85-7a82-45e5-bb4c-abbcae2433bf': { beginner: 35, intermediate: 45, expert: 20 }
  },
  '2af03917-662c-4d55-9953-0f3b60e93a42': {
    '44a1dec4-d063-4502-b181-e1f169df4627': { beginner: 30, intermediate: 30, expert: 40 },
    '5a21fe1c-1a3f-4238-9323-939c2d381b04': { beginner: 25, intermediate: 35, expert: 40 },
    '2b4e29e2-bf11-4339-8222-bda126503cbe': { beginner: 35, intermediate: 40, expert: 25 },
    'ceffd358-dff8-4c13-9c88-7d85a8107ee7': { beginner: 20, intermediate: 50, expert: 30 },
    '93fa0031-0323-4fe4-a162-f490ab9b6e8d': { beginner: 25, intermediate: 45, expert: 30 }
  },
  'b69fb7bf-9929-4acb-af12-5974aaeebb70': {
    '99719c09-8138-4c27-b2e4-7e941a14953f': { beginner: 20, intermediate: 50, expert: 30 },
    '39bee551-8449-45f7-9f7d-abda6836a740': { beginner: 40, intermediate: 40, expert: 20 },
    '1a3b8dd5-fb0d-4b2f-9d7c-4bc71bc45bb0': { beginner: 35, intermediate: 35, expert: 30 },
    'b1160032-5181-4951-a46b-891e9568247c': { beginner: 50, intermediate: 30, expert: 20 },
    '5b7c4b45-2bb9-47d8-84bb-5902b1cf81e0': { beginner: 30, intermediate: 40, expert: 30 }
  }
}

const statusDistribution = {
  '9044ba17-8e4c-40be-87ad-a9f0424cec74': {
    '5d5d95db-8179-45f3-87ac-16c308c63405': { pending: 20, inProgress: 30, completed: 50 },
    'eb4cf705-cd7d-41a0-9556-f833623f9027': { pending: 12, inProgress: 18, completed: 70 },
    '50a3a4b1-8461-425b-a0e5-8836f47b6287': { pending: 15, inProgress: 25, completed: 60 },
    '80e69aa0-5292-4bf6-964b-1f7e744f6dc1': { pending: 7, inProgress: 28, completed: 65 },
    'a7358f85-7a82-45e5-bb4c-abbcae2433bf': { pending: 10, inProgress: 15, completed: 75 }
  },
  '2af03917-662c-4d55-9953-0f3b60e93a42': {
    '44a1dec4-d063-4502-b181-e1f169df4627': { pending: 12, inProgress: 18, completed: 70 },
    '5a21fe1c-1a3f-4238-9323-939c2d381b04': { pending: 15, inProgress: 30, completed: 55 },
    '2b4e29e2-bf11-4339-8222-bda126503cbe': { pending: 8, inProgress: 27, completed: 65 },
    'ceffd358-dff8-4c13-9c88-7d85a8107ee7': { pending: 5, inProgress: 20, completed: 75 },
    '93fa0031-0323-4fe4-a162-f490ab9b6e8d': { pending: 10, inProgress: 30, completed: 60 }
  },
  'b69fb7bf-9929-4acb-af12-5974aaeebb70': {
    '99719c09-8138-4c27-b2e4-7e941a14953f': { pending: 8, inProgress: 24, completed: 68 },
    '39bee551-8449-45f7-9f7d-abda6836a740': { pending: 20, inProgress: 25, completed: 55 },
    '1a3b8dd5-fb0d-4b2f-9d7c-4bc71bc45bb0': { pending: 18, inProgress: 22, completed: 60 },
    'b1160032-5181-4951-a46b-891e9568247c': { pending: 25, inProgress: 20, completed: 55 },
    '5b7c4b45-2bb9-47d8-84bb-5902b1cf81e0': { pending: 10, inProgress: 15, completed: 75 }
  }
}

const priorityDistribution = {
  '9044ba17-8e4c-40be-87ad-a9f0424cec74': {
    '5d5d95db-8179-45f3-87ac-16c308c63405': { low: 10, normal: 60, high: 30 },
    'eb4cf705-cd7d-41a0-9556-f833623f9027': { low: 20, normal: 50, high: 30 },
    '50a3a4b1-8461-425b-a0e5-8836f47b6287': { low: 15, normal: 55, high: 30 },
    '80e69aa0-5292-4bf6-964b-1f7e744f6dc1': { low: 20, normal: 55, high: 25 },
    'a7358f85-7a82-45e5-bb4c-abbcae2433bf': { low: 20, normal: 60, high: 20 }
  },
  '2af03917-662c-4d55-9953-0f3b60e93a42': {
    '44a1dec4-d063-4502-b181-e1f169df4627': { low: 15, normal: 60, high: 25 },
    '5a21fe1c-1a3f-4238-9323-939c2d381b04': { low: 15, normal: 55, high: 30 },
    '2b4e29e2-bf11-4339-8222-bda126503cbe': { low: 20, normal: 50, high: 30 },
    'ceffd358-dff8-4c13-9c88-7d85a8107ee7': { low: 10, normal: 50, high: 40 },
    '93fa0031-0323-4fe4-a162-f490ab9b6e8d': { low: 20, normal: 50, high: 30 }
  },
  'b69fb7bf-9929-4acb-af12-5974aaeebb70': {
    '99719c09-8138-4c27-b2e4-7e941a14953f': { low: 25, normal: 45, high: 30 },
    '39bee551-8449-45f7-9f7d-abda6836a740': { low: 30, normal: 40, high: 30 },
    '1a3b8dd5-fb0d-4b2f-9d7c-4bc71bc45bb0': { low: 25, normal: 50, high: 25 },
    'b1160032-5181-4951-a46b-891e9568247c': { low: 35, normal: 45, high: 20 },
    '5b7c4b45-2bb9-47d8-84bb-5902b1cf81e0': { low: 18, normal: 52, high: 30 }
  }
}

const Dashboard = () => {
  const dispatch = useDispatch()

  const { collapsed } = useSelector((state) => state.menu)
  const { teamsMap } = useSelector((state) => state.teams)
  const { projects, projectsMap } = useSelector((state) => state.projects)

  const [selectedProject, setSelectedProject] = useState(null)
  const [selectedTeam, setSelectedTeam] = useState(null)

  useEffect(() => {
    dispatch(setActive(menuIndices.dashboard))
  }, [])

  useEffect(() => {
    setSelectedTeam(null)
  }, [selectedProject])

  return (
    <section id="dashboard">
      <Menu />
      <section className={`content ${collapsed ? "expanded" : null}`} >
        <div className="select-options">
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
        </div>
        {/* <div className="charts no-scrollbar">
          <PriorityDistribution priorityDistribution={priorityDistribution} />
          <StatusDistribution statusDistribution={statusDistribution} />
          {selectedProject && (
            <ProjectWorkload project={projectsMap[selectedProject.value].title} workload={workloads?.[selectedProject.value]} />
          )}
          {selectedProject && selectedTeam && (
            <ProjectExpertise
              team={teamsMap[selectedTeam.value].name}
              expertise={expertiseDistribution[selectedProject.value][selectedTeam.value]}
            />
          )}
        </div> */}
      </section>
    </section>
  )
}

export default Dashboard
