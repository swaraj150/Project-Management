import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import MembersList from '../components/common/MembersList'
import RequestList from '../components/common/RequestList'

import { authorizedUser } from '../utils/organization.utils'

const Organization = () => {
  const { user } = useSelector((state) => state.user)
  const { organization } = useSelector((state) => state.organization)

  const [activeSection, setActiveSection] = useState(0)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    setIsAuthorized(authorizedUser(user))
  }, [user])

  return (
    <section id="organization">
      <div className="organization-heading">
        <h2 className="title h1">{organization.name}</h2>
        {
          isAuthorized ? (
            <div className="cta">
              <button
                className={`pointer ${activeSection === 0 ? "active" : null}`}
                onClick={() => setActiveSection(0)}
              >
                Members
              </button>
              <button
                className={`pointer ${activeSection === 1 ? "active" : null}`}
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
          ? <MembersList members={organization.members} isAuthorized={isAuthorized} />
          : <RequestList />
      }
    </section>
  )
}

export default Organization