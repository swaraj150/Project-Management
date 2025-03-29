import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { IoMdAdd } from 'react-icons/io'

import Menu from '../components/common/Menu'
import CreateTeam from '../components/common/CreateTeam'
import TeamsList from '../components/common/TeamsList'

import { roles } from '../utils/organization.utils'

const Teams = () => {
  const modalRef = useRef(null)

  const { user } = useSelector((state) => state.user)
  const { teams } = useSelector((state) => state.teams)
  const { collapsed } = useSelector((state) => state.menu)

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
    <section id="teams">
      <Menu />
      <section className={`content ${collapsed ? "expanded" : null}`} >
        {modalOpen ? <CreateTeam setModalOpen={setModalOpen} modalRef={modalRef} /> : null}
        <div className="heading">
          <h2 className="title h1">Teams</h2>
          {
            user.projectRole === roles.productOwner || user.projectRole === roles.projectManager ? (
              <button className="cta pointer dark-btn" onClick={() => setModalOpen(true)}>
                <IoMdAdd />
                <p>Create Team</p>
              </button>
            ) : null
          }
        </div>
        <p className="opacity-7">Teams Count: {teams.length}</p>
        <TeamsList />
      </section>
    </section>
  )
}

export default Teams