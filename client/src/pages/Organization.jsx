import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Menu from '../components/common/Menu'
import MembersList from '../components/common/MembersList'
import RequestList from '../components/common/RequestList'

import { setActive } from '../redux/features/menuSlice'

import { menuIndices } from '../utils/menu.utils'
import { roles } from '../utils/organization.utils'

const Organization = () => {
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.user)
  const { organization } = useSelector((state) => state.organization)
  const { collapsed } = useSelector((state) => state.menu)

  const [activeSection, setActiveSection] = useState(0)

  useEffect(() => {
    dispatch(setActive(menuIndices.organization))
  }, [])

  return (
    <section id='organization'>
      <Menu />
      <section className={`content ${collapsed ? 'expanded' : null}`} >
        <div className='organization-heading'>
          <h2 className='title h1'>{organization?.name}</h2>
          {
            user?.projectRole === roles.productOwner ? (
              <div className='cta'>
                <button
                  className={`pointer ${activeSection === 0 ? 'dark-btn' : null}`}
                  onClick={() => setActiveSection(0)}
                >
                  Members
                </button>
                <button
                  className={`pointer ${activeSection === 1 ? 'dark-btn' : null}`}
                  onClick={() => setActiveSection(1)}
                >
                  Requests
                </button>
              </div>
            ) : null
          }
        </div>
        {
          activeSection === 0
            ? <MembersList />
            : <RequestList />
        }
      </section>
    </section>
  )
}

export default Organization