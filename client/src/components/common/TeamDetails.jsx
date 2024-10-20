import React from 'react'
import { RxCross1 } from 'react-icons/rx'

const TeamDetails = ({ team, setModalOpen, modalRef }) => {
  return (
    <div ref={modalRef} className="modal paper">
      <RxCross1 className="modal-close pointer" onClick={() => setModalOpen(false)} />
      <h2>{team.name}</h2>
      <div className="team-lead">
        <p className="opacity-7">Team Lead</p>
        <div className="team-lead-details">
          <h3>{team.teamLead.name}</h3>
          <a href={`mailto:${team.teamLead.emails[0]}`} className="opacity-5" >
            {team.teamLead.emails[0]}
          </a>
        </div>
      </div>
      <div className="developers">
        <p className="opacity-7">Developers ({team.developers.length})</p>
        <ul className="developers-list">
          {
            team.developers.map((developer, index) => (
              <li key={index} >
                <h3>{developer.name}</h3>
                <a href={`mailto:${developer.emails[0]}`} className="opacity-5" >
                  {developer.emails[0]}
                </a>
              </li>
            ))
          }
        </ul>
      </div>
      <div className="testers">
        <p className="opacity-7">Testers ({team.testers.length})</p>
        <ul className="testers-list">
          {
            team.testers.map((tester, index) => (
              <li key={index} >
                <h3>{tester.name}</h3>
                <a href={`mailto:${tester.emails[0]}`} className="opacity-5" >
                  {tester.emails[0]}
                </a>
              </li>
            ))
          }
        </ul>
      </div>
    </div>
  )
}

export default TeamDetails