import React from 'react'
import { useSelector } from 'react-redux'

import Project from './Project'

const ProjectsList = () => {
  const { projects } = useSelector((state) => state.projects)

  return (
    <ul className="projects-list no-scrollbar">
      {
        projects.map((project, index) => (
          <Project key={index} project={project} />
        ))
      }
    </ul>
  )
}

export default ProjectsList