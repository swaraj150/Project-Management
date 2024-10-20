import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { IoMdAdd } from 'react-icons/io'

import CreateTeam from '../components/common/CreateTeam'
import TeamsList from '../components/common/TeamsList'

const Teams = () => {
  const modalRef = useRef(null)

  const { teams } = useSelector((state) => state.teams)

  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isSelectElement = event.target.parentElement?.classList.contains('css-tj5bde-Svg')

      if (modalRef.current && !modalRef.current.contains(event.target) && !isSelectElement) {
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
      {modalOpen ? <CreateTeam setModalOpen={setModalOpen} modalRef={modalRef} /> : null}
      <div className="heading">
        <h2 className="title h1">Teams</h2>
        <button className="cta pointer" onClick={() => setModalOpen(true)}>
          <IoMdAdd />
          <p>Create Team</p>
        </button>
      </div>
      <p className="opacity-7">Teams Count: {teams.length}</p>
      <TeamsList />
    </section>
  )
}

export default Teams