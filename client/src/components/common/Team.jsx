import React, { useEffect, useRef, useState } from 'react'
import { IoEllipsisHorizontalCircle } from 'react-icons/io5'

import TeamDetails from './TeamDetails'

import { membersCount, developersCount, testersCount } from '../../utils/team.utils'

const Team = ({ team }) => {
  const modalRef = useRef(null)

  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) setModalOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  })

  return (
    <div className="team-list-info">
      {modalOpen ? <TeamDetails team={team} setModalOpen={setModalOpen} modalRef={modalRef} /> : null}
      <p className="team-list-info-item" >{team.name}</p>
      <p className="team-list-info-item" >{team.teamLead.name}</p>
      <p className="team-list-info-item" >{membersCount(team)}</p>
      <p className="team-list-info-item" >{developersCount(team)}</p>
      <p className="team-list-info-item" >{testersCount(team)}</p>
      <IoEllipsisHorizontalCircle className="pointer" onClick={() => setModalOpen(true)} />
    </div>
  )
}

export default Team