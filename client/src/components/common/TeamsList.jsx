import React from 'react'
import { useSelector } from 'react-redux'

import Team from './Team'

import { headings } from '../../utils/team.utils'

const TeamsList = () => {
  const { teams, teamsMap } = useSelector((state) => state.teams)

  return (
    <ul className="teams-list">
      <div className="teams-list-headings paper-1">
        {
          headings.map((heading, index) => (
            <p key={index} >{heading}</p>
          ))
        }
      </div>
      <ul className="teams-list-items no-scrollbar">
        {
          teams.map((team, index) => (
            <Team key={index} team={teamsMap[team]} />
          ))
        }
      </ul>
    </ul>
  )
}

export default TeamsList