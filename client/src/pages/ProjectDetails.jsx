import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { IoMdArrowBack } from 'react-icons/io'
import { FaRegCalendarAlt, FaRupeeSign } from 'react-icons/fa'

// import AddTask from './AddTask'
// import AddTeam from './AddTeam'
import Menu from '../components/common/Menu'
import Team from '../components/common/Team'

import { setActive } from '../redux/features/menuSlice'

import { menuIndices } from '../utils/menu.utils'
import { formatBudget, formatDate } from '../utils/project.utils'
import { headings, membersCount } from '../utils/team.utils'
import { roles } from '../utils/organization.utils'

const ProjectDetails = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { project } = location.state || {}

  const { user } = useSelector((state) => state.user)
  const { teamsMap } = useSelector((state) => state.teams)
  const { membersMap } = useSelector((state) => state.organization)

  const { collapsed } = useSelector((state) => state.menu)
  const [addTeamModalOpen, setAddTeamModalOpen] = useState(false)
  const [addTaskModalOpen, setAddTaskModalOpen] = useState(false)

  const handleGoBack = () => {
    navigate(-1)
  }

  useEffect(() => {
    dispatch(setActive(menuIndices.projects))
  }, [])

  useEffect(() => {
    if (!project) handleGoBack()
  }, [project])

  return (
    <section id="project-details">
      <Menu />
      <section className={`content ${collapsed ? "expanded" : null}`} >
        <button className='go-back pointer paper-1' onClick={handleGoBack}>
          <IoMdArrowBack />
          <p>Go Back</p>
        </button>
        <div className="cta">
          {
            user.projectRole === roles.productOwner || user.projectRole === roles.projectManager ? (
              <button className="pointer paper-1" onClick={() => setAddTeamModalOpen(true)} >Add Team</button>
            ) : null
          }
          {
            user.projectRole === roles.productOwner || user.projectRole === roles.projectManager || user.projectRole === roles.teamLead ? (
              <button className="pointer paper-1 dark-btn" onClick={() => setAddTaskModalOpen(true)} >Add Task</button>
            ) : null
          }
        </div>
        <div className="information">
          <h2>{project.title}</h2>
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
            <p className='opacity-7'>Project Manager</p>
            <div className="project-manager-details">
              <img className='profile-img' src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" alt="" />
              <h4>{membersMap[project.projectManager].name}</h4>
              <a href={`mailto:${membersMap[project.projectManager].emails[0]}`} className="opacity-7" >
                {membersMap[project.projectManager].emails[0]}
              </a>
            </div>
          </div>
          <div className="teams">
            <p>Teams ({project.teams.length})</p>
            <div className="teams-list">
              <div className="teams-list-headings paper-1">
                {
                  headings.map((heading, index) => (
                    <p key={index} >{heading}</p>
                  ))
                }
              </div>
              <ul className="teams-list-items no-scrollbar">
                {
                  project.teams.map((team, index) => (
                    <Team key={index} team={teamsMap[team]} />
                  ))
                }
              </ul>
            </div>
          </div>
        </div>
      </section>
    </section>
    // <div ref={modalRef} className="modal paper">
    //   {addTeamModalOpen ? <AddTeam project={project} setAddTeamModalOpen={setAddTeamModalOpen} modalRef={modalRef} /> : null}
    //   {/* {addTaskModalOpen ? <AddTask project={project} setAddTaskModalOpen={setAddTaskModalOpen} modalRef={modalRef} /> : null} */}
    //   <RxCross1 className="modal-close pointer" onClick={() => setModalOpen(false)} />
    //   <div className="heading">
    //     
    //   </div>
    // </div>
  )
}

export default ProjectDetails