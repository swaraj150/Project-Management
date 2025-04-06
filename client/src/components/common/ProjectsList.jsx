import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

import Project from './Project'

const ProjectsList = () => {
  const { projects, projectsMap } = useSelector((state) => state.projects)

  useEffect(() => {
    console.log(projects, projectsMap)
  }, [projects, projectsMap])

  return (
    <ul className="projects-list no-scrollbar">
      {
        projects.length > 0 && projects.map((project, index) => (
          <Project key={index} project={projectsMap[project]} />
        ))
      }
    </ul>
  )
}

export default ProjectsList