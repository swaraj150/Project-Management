import React from 'react'

import { membersCount, developersCount, testersCount } from '../../utils/team.utils'

const Team = ({ team }) => {
  return (
    <div className="team-list-info">
      <p>{team.name}</p>
      <p>{team.teamLead.name}</p>
      <p>{membersCount(team)}</p>
      <p>{developersCount(team)}</p>
      <p>{testersCount(team)}</p>
    </div>
  )
}

export default Team