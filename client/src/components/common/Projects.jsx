import React from 'react'
import { useSelector } from 'react-redux'

import ProjectsHome from './ProjectsHome'
import ProjectsInfo from './ProjectsInfo'

const Projects = () => {
  const { organization } = useSelector((state) => state.organization)

  return (
    <section id="projects">
      {
        organization ? (
          <ProjectsHome />
        ) : (
          <ProjectsInfo />
        )
      }
    </section>
  )
}

export default Projects