import React, { useEffect, useRef, useState } from 'react'
import { FaRegCalendarAlt, FaRupeeSign } from 'react-icons/fa'

import ProjectDetails from './ProjectDetails'

import { formatDate, formatBudget } from '../../utils/project.utils'

const Project = ({ project }) => {
  const modalRef = useRef(null)

  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isIndicatorClick = 
        event.target.classList.contains('css-15lsz6c-indicatorContainer') ||
        event.target.classList.contains('css-tj5bde-Svg') ||
        event.target.tagName.toLowerCase() === 'path' ||
        event.target.closest('.css-15lsz6c-indicatorContainer') !== null

      if (modalRef.current && !modalRef.current.contains(event.target) && !isIndicatorClick) {
        setModalOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  })

  return (
    <li className="project-info paper">
      {modalOpen ? <ProjectDetails project={project} setModalOpen={setModalOpen} modalRef={modalRef} /> : null}
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
        <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" alt="" />
        <div className="project-manager-details">
          <p>{project.projectManager.name} &nbsp;&nbsp;</p>
          <a href={`mailto:${project.projectManager.emails[0]}`} className="opacity-5" >
            {project.projectManager.emails[0]}
          </a>
        </div>
      </div>
      <small className="opacity-7 pointer" onClick={() => setModalOpen(true)} >See project details and progress</small>
    </li>
  )
}

export default Project