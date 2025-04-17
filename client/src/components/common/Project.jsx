import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaRegCalendarAlt, FaRupeeSign } from 'react-icons/fa'

import { useSelection } from '../../contexts/SelectionContext'

import { formatDate, formatBudget } from '../../utils/project.utils'

const Project = ({ project }) => {
  const navigate = useNavigate()

  const { membersMap } = useSelector((state) => state.organization)

  const { setSelectedUser, setSelectedProject } = useSelection()

  const handleGoToDetails = () => {
    setSelectedProject(project)
    navigate(`/projects/${project.title}`)
  }

  const viewProfile = () => {
    setSelectedUser(membersMap[project.projectManager])
    navigate(`/profile/${membersMap[project.projectManager].username}`)
  }

  return (
    <li className="project-info paper-1">
      <h3>{project.title}</h3>
      <small className="opacity-5 description" >{project.description}</small>
      <div className="date opacity-7">
        <FaRegCalendarAlt />
        {formatDate(project.startDate)} - {project.endDate ? formatDate(project.endDate) : formatDate(project.estimatedEndDate)}
      </div>
      <div className="budget opacity-7">
        <FaRupeeSign />
        {formatBudget(project.budget)}
      </div>
      <div className="project-manager">
        <img className='profile-img' src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" alt="" />
        <div className="project-manager-details">
          <p className='pointer' onClick={viewProfile}>{membersMap[project.projectManager].name} &nbsp;&nbsp;</p>
          <a href={`mailto:${membersMap[project.projectManager].emails[0]}`} className="opacity-5" >
            {membersMap[project.projectManager].emails[0]}
          </a>
        </div>
      </div>
      <small className="opacity-7 pointer" onClick={handleGoToDetails}>See project details and progress</small>
    </li>
  )
}

export default Project