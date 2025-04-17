import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { IoMdAdd } from 'react-icons/io'

import Menu from '../components/common/Menu'
import ProjectsList from '../components/common/ProjectsList'

import { useSelection } from '../contexts/SelectionContext'

import { setActive } from '../redux/features/menuSlice'

import { menuIndices } from '../utils/menu.utils'
import { roles } from '../utils/organization.utils'

const Projects = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user } = useSelector((state) => state.user)
  const { projects, projectsMap } = useSelector((state) => state.projects)
  const { collapsed } = useSelector((state) => state.menu)

  const { setSelectedProject } = useSelection()

  useEffect(() => {
    dispatch(setActive(menuIndices.projects))
  }, [])

  useEffect(() => {
    if (user.projectRole !== roles.productOwner && projects.length === 1) {
      setSelectedProject(projectsMap[projects[0]])
      navigate(`/projects/${projectsMap[projects[0]].title}`)
    }
  }, [])

  return (
    <section id="projects">
      <Menu />
      <section className={`content ${collapsed ? "expanded" : null}`} >
        {
          user.projectRole === roles.productOwner ? (
            <>
              <div className="heading">
                <h2 className="title h1">Projects</h2>
                <button className="cta pointer dark-btn paper-1" onClick={() => navigate('create')}>
                  <IoMdAdd />
                  <p>Create Project</p>
                </button>
              </div>
              <p className="opacity-7">Projects Count: {projects.length}</p>
              <ProjectsList />
            </>
          ) : (
            <p>You are currently not part of any project</p>
          )
        }
      </section>
    </section>
  )
}

export default Projects