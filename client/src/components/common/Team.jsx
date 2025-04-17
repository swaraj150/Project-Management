import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { useSelection } from '../../contexts/SelectionContext'

import { membersCount, developersCount, testersCount } from '../../utils/team.utils'

const Team = ({ team }) => {
  const navigate = useNavigate()

  const { membersMap } = useSelector((state) => state.organization)

  const { setSelectedTeam } = useSelection()

  const handleGoToDetails = () => {
    setSelectedTeam(team)
    navigate(`/teams/${team.name}`)
  }

  return (
    <div className="teams-list-info paper-1 pointer" onClick={handleGoToDetails}>
      <p className="teams-list-info-item" >{team.name}</p>
      <p className="teams-list-info-item" >{membersMap[team.teamLead].name}</p>
      <p className="teams-list-info-item" >{membersCount(team)}</p>
      <p className="teams-list-info-item" >{developersCount(team)}</p>
      <p className="teams-list-info-item" >{testersCount(team)}</p>
    </div>
  )
}

export default Team