import React from 'react'
import { useSelector } from 'react-redux'

import MembersList from '../components/common/MembersList'

const Organization = () => {
  const { organization } = useSelector((state) => state.organization)

  return (
    <section id="organization">
      <h2 className="title h1">{organization.name}</h2>
      <div className="members">
        <small className='opacity-5'>Manage members access</small>
        <div className="members-info">
          <div className="heading">
            <h2 className="title">Members</h2>
          </div>
          <div className="cta">
            <p>{organization.members.length} members</p>
          </div>
        </div>
        <MembersList members={organization.members} />
      </div>
    </section>
  )
}

export default Organization