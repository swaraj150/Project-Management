import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { IoMdArrowBack } from 'react-icons/io'

import Menu from '../components/common/Menu'

import { useProject } from '../contexts/ProjectContext'

import { setActive } from '../redux/features/menuSlice'

import { menuIndices } from '../utils/menu.utils'

const TeamDetails = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { collapsed } = useSelector((state) => state.menu)
  const { membersMap } = useSelector((state) => state.organization)

  const { selectedTeam } = useProject()

  const handleGoBack = () => {
    navigate(-1)
  }

  useEffect(() => {
    dispatch(setActive(menuIndices.teams))
  }, [])

  useEffect(() => {
    if (!selectedTeam) handleGoBack()
  }, [selectedTeam])

  return (
    <section id="team-details">
      <Menu />
      <section className={`content ${collapsed ? "expanded" : null}`} >
        <button className='go-back pointer paper-1' onClick={handleGoBack}>
          <IoMdArrowBack />
          <p>Go Back</p>
        </button>
        {
          selectedTeam && (
            <div className="information">
              <h2>{selectedTeam.name}</h2>
              <div className="team-lead">
                <p className="opacity-7">Team Lead</p>
                <div className="team-lead-details">
                  <img className='profile-img' src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" alt="" />
                  <h3>{membersMap[selectedTeam.teamLead].name}</h3>
                  <a href={`mailto:${membersMap[selectedTeam.teamLead].emails[0]}`} className="opacity-5" >
                    {membersMap[selectedTeam.teamLead].emails[0]}
                  </a>
                </div>
              </div>
              <div className="developers">
                <p className="opacity-7">Developers ({selectedTeam.developers.length})</p>
                <ul className="list no-scrollbar">
                  {
                    selectedTeam.developers.map((developer, index) => (
                      <li key={index} >
                        <img className='profile-img' src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" alt="" />
                        <h3>{membersMap[developer].name}</h3>
                        <a href={`mailto:${membersMap[developer].emails[0]}`} className="opacity-5" >
                          {membersMap[developer].emails[0]}
                        </a>
                      </li>
                    ))
                  }
                </ul>
              </div>
              <div className="testers">
                <p className="opacity-7">Testers ({selectedTeam.testers.length})</p>
                <ul className="list no-scrollbar">
                  {
                    selectedTeam.testers.map((tester, index) => (
                      <li key={index} >
                        <img className='profile-img' src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" alt="" />
                        <h3>{membersMap[tester].name}</h3>
                        <a href={`mailto:${membersMap[tester].emails[0]}`} className="opacity-5" >
                          {membersMap[tester].emails[0]}
                        </a>
                      </li>
                    ))
                  }
                </ul>
              </div>
            </div>
          )
        }
      </section>
    </section>
  )

}

export default TeamDetails