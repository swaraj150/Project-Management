import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { IoEllipsisHorizontalCircle } from 'react-icons/io5'

import { membersCount, developersCount, testersCount } from '../../utils/team.utils'

const Team = ({ team }) => {
  const navigate = useNavigate()

  const { membersMap } = useSelector((state) => state.organization)

  return (
    <div className="teams-list-info paper-1">
      <p className="teams-list-info-item" >{team.name}</p>
      <p className="teams-list-info-item" >{membersMap[team.teamLead].name}</p>
      <p className="teams-list-info-item" >{membersCount(team)}</p>
      <p className="teams-list-info-item" >{developersCount(team)}</p>
      <p className="teams-list-info-item" >{testersCount(team)}</p>
      <IoEllipsisHorizontalCircle className="pointer" onClick={() => navigate(`/teams/${team.name}`, { state: { team } })} />
    </div>
  )
}

export default Team