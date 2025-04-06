import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { IoMdAdd } from 'react-icons/io'

import Menu from '../components/common/Menu'
import TeamsList from '../components/common/TeamsList'

import { setActive } from '../redux/features/menuSlice'

import { menuIndices } from '../utils/menu.utils'
import { roles } from '../utils/organization.utils'

const Teams = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user } = useSelector((state) => state.user)
  const { teams } = useSelector((state) => state.teams)
  const { collapsed } = useSelector((state) => state.menu)

  useEffect(() => {
    dispatch(setActive(menuIndices.teams))
  }, [])

  return (
    <section id="teams">
      <Menu />
      <section className={`content ${collapsed ? "expanded" : null}`} >
        <div className="heading">
          <h2 className="title h1">Teams</h2>
          {
            user.projectRole === roles.productOwner || user.projectRole === roles.projectManager ? (
              <button className="cta pointer dark-btn paper-1" onClick={() => navigate('create')}>
                <IoMdAdd />
                <p>Create Team</p>
              </button>
            ) : null
          }
        </div>
        <p className="opacity-7">Teams Count: {teams.length}</p>
        <TeamsList />
      </section>
    </section>
  )
}

export default Teams