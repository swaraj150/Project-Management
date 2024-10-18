import React from 'react'
import { useSelector } from 'react-redux'

import Team from './Team'

const headings = [
  'Team Name',
  'Team Lead',
  'Members',
  'Developers',
  'Testers'
]

const TeamsList = () => {
  const { teams } = useSelector((state) => state.teams)

  return (
    <div className="teams-list no-scrollbar">
      <div className="team-list-headings">
        {
          headings.map((heading, index) => (
            <p>{heading}</p>
          ))
        }
      </div>
      {
        teams.map((team, index) => (
          <Team key={index} team={team} />
        ))
      }
    </div>
  )
}

export default TeamsList