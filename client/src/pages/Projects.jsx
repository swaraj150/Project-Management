import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { IoMdAdd } from 'react-icons/io'

import CreateProject from '../components/common/CreateProject'
import ProjectsList from '../components/common/ProjectsList'

import { roles } from '../utils/organization.utils'

const Projects = () => {
  const modalRef = useRef(null)

  const { user } = useSelector((state) => state.user)
  const { projects } = useSelector((state) => state.projects)

  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setModalOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  })

  return (
    <section id="projects">
      {modalOpen ? <CreateProject setModalOpen={setModalOpen} modalRef={modalRef} /> : null}
      <div className="heading">
        <h2 className="title h1">Projects</h2>
        {
          user.projectRole === roles.productOwner ? (
            <button className="cta pointer" onClick={() => setModalOpen(true)}>
              <IoMdAdd />
              <p>Create Project</p>
            </button>
          ) : null
        }
      </div>
      <p className="opacity-7">Projects Count: {projects.length}</p>
      <ProjectsList />
    </section>
  )
}

export default Projects