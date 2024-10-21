import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { RxCross1 } from 'react-icons/rx'
import { FaRegCalendarAlt, FaRupeeSign } from 'react-icons/fa'

// import AddTask from './AddTask'
import AddTeam from './AddTeam'

import { formatBudget, formatDate } from '../../utils/project.utils'
import { membersCount } from '../../utils/team.utils'
import { roles } from '../../utils/organization.utils'

const ProjectDetails = ({ project, setModalOpen, modalRef }) => {
  const { user } = useSelector((state) => state.user)
  const { teams } = useSelector((state) => state.teams)

  const [addTeamModalOpen, setAddTeamModalOpen] = useState(false)
  const [addTaskModalOpen, setAddTaskModalOpen] = useState(false)

  const projectTeams = teams.filter((team) => project.teams.includes(team.id))

  return (
    <div ref={modalRef} className="modal paper">
      {addTeamModalOpen ? <AddTeam project={project} setAddTeamModalOpen={setAddTeamModalOpen} modalRef={modalRef} /> : null}
      {/* {addTaskModalOpen ? <AddTask project={project} setAddTaskModalOpen={setAddTaskModalOpen} modalRef={modalRef} /> : null} */}
      <RxCross1 className="modal-close pointer" onClick={() => setModalOpen(false)} />
      <div className="heading">
        <h2>{project.title}</h2>
        <div className="cta">
          {
            user.projectRole === roles.productOwner || user.projectRole === roles.projectManager ? (
              <button className="pointer paper-1" onClick={() => setAddTeamModalOpen(true)} >Add Team</button>
            ) : null
          }
          {
            user.projectRole === roles.productOwner || user.projectRole === roles.projectManager || user.projectRole === roles.teamLead ? (
              <button className="pointer paper-1" onClick={() => setAddTaskModalOpen(true)} >Add Task</button>
            ) : null
          }
        </div>
      </div>
      <p>{project.description}</p>
      <div className="date">
        <FaRegCalendarAlt />
        {formatDate(project.startDate)} - {project.endDate ? formatDate(project.endDate) : formatDate(project.estimatedEndDate)}
      </div>
      <div className="budget">
        <FaRupeeSign />
        {formatBudget(project.budget)}
      </div>
      <div className="project-manager">
        <p>Project Manager</p>
        <div className="project-manager-details">
          <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" alt="" />
          <h4>{project.projectManager.name}</h4>
          <a href={`mailto:${project.projectManager.emails[0]}`} className="opacity-7" >
            {project.projectManager.emails[0]}
          </a>
        </div>
      </div>
      <div className="teams">
        <p>Teams ({project.teams.length})</p>
        <div className="teams-list-headings paper-1">
          <p>Name</p>
          <p>Team Lead</p>
          <p>Members</p>
        </div>
        <ul className="teams-list no-scrollbar">
          {
            projectTeams.map((projectTeam, index) => (
              <li>
                <p>{projectTeam.name}</p>
                <p>{projectTeam.teamLead.name}</p>
                <p>{membersCount(projectTeam)}</p>
              </li>
            ))
          }
        </ul>
      </div>
    </div>
  )
}

export default ProjectDetails