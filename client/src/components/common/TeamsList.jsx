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
    <ul className="teams-list">
      <div className="team-list-headings">
        {
          headings.map((heading, index) => (
            <p key={index} >{heading}</p>
          ))
        }
      </div>
      <ul className="team-list-items no-scrollbar">
        {
          teams.map((team, index) => (
            <Team key={index} team={team} />
          ))
        }
      </ul>
    </ul>
  )
}

export default TeamsList