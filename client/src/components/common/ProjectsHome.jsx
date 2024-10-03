import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import { CiCalendar } from 'react-icons/ci'
import { MdCurrencyRupee, MdAdd } from 'react-icons/md'
import { IoIosArrowDown, IoIosArrowUp, IoMdAddCircleOutline } from 'react-icons/io'

import ProjectForm from './ProjectsForm'

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  })
}

const formatBudget = (budget) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(budget)
}

const getTotalTeamMembers = (team) => {
  return team.developers.length + team.testers.length + 1;
}

const ProjectsHome = () => {
  const { projects } = useSelector((state) => state.projects)

  const [displayTeams, setDisplayTeams] = useState(false)
  const [displayForm, setDisplayForm] = useState(true)

  return (
    <div className="home">
      {
        displayForm && <ProjectForm />
      }
      <div className="heading">
        <h1 className='h1'>Projects</h1>
        <div className="cta-btn pointer" >
          <MdAdd />
          <strong>Create Project</strong>
        </div>
      </div>
      <div className="projects-list">
        {
          projects.length > 0 ? (
            projects.map((project, index) => (
              <div className="project-card paper">
                <div className="project-title">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <h4>PM: {project.projectManager.username}</h4>
                </div>
                <div className="info-grid">
                  <div className="date">
                    <CiCalendar />
                    <div className="period">
                      <p>Start: {formatDate(project.startDate)}</p>
                      <p>End: {project.endDate ? formatDate(project.endDate) : formatDate(project.estimatedEndDate)}</p>
                    </div>
                  </div>
                  <div className="budget">
                    <MdCurrencyRupee />
                    <p>{formatBudget(project.budget)}</p>
                  </div>
                </div>
                <p>
                  Status: {project.completionStatus ? "Completed" : "Pending"}
                </p>
                <div className="teams">
                  {
                    project.teams.length === 0 ? (
                      <p>No teams assigned</p>
                    ) : (
                      <div className="team-title">
                        <strong>Teams: {project.teams.length}</strong>
                        {
                          displayTeams ? (
                            <IoIosArrowUp className='pointer' onClick={() => setDisplayTeams(false)} />
                          ) : (
                            <IoIosArrowDown className='pointer' onClick={() => setDisplayTeams(true)} />
                          )
                        }
                      </div>
                    )
                  }
                  {
                    displayTeams && (
                      <div className="teams-list">
                        {
                          project.teams.map((team, index) => (
                            <div className="teams-card paper-1">
                              <p>{team.name}</p>
                              <p>Team Members: {getTotalTeamMembers(team)}</p>
                              <p>TL: {team.teamLead.name}</p>
                            </div>
                          ))
                        }
                      </div>
                    )
                  }
                  <div className="add-team-btn pointer">
                    <IoMdAddCircleOutline />
                    <strong>Add Team</strong>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No projects to display</p>
          )
        }
      </div>
    </div>
  )
}

export default ProjectsHome