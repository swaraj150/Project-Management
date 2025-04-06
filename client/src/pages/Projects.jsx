import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { IoMdAdd } from 'react-icons/io'

import Menu from '../components/common/Menu'
import ProjectsList from '../components/common/ProjectsList'

import { setActive } from '../redux/features/menuSlice'

import { menuIndices } from '../utils/menu.utils'
import { roles } from '../utils/organization.utils'

const Projects = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user } = useSelector((state) => state.user)
  const { projects } = useSelector((state) => state.projects)
  const { collapsed } = useSelector((state) => state.menu)

  useEffect(() => {
    dispatch(setActive(menuIndices.projects))
  }, [])

  return (
    <section id="projects">
      <Menu />
      <section className={`content ${collapsed ? "expanded" : null}`} >
        <div className="heading">
          <h2 className="title h1">Projects</h2>
          {
            user.projectRole === roles.productOwner ? (
              <button className="cta pointer dark-btn paper-1" onClick={() => navigate('create')}>
                <IoMdAdd />
                <p>Create Project</p>
              </button>
            ) : null
          }
        </div>
        <p className="opacity-7">Projects Count: {projects.length}</p>
        <ProjectsList />
      </section>
    </section>
  )
}

export default Projects