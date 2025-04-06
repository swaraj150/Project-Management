import React from 'react'
import { useSelector } from 'react-redux'

import Member from './Member'

const MembersList = () => {
  const { members, membersMap } = useSelector((state) => state.organization)

  return (
    <section className="members">
      <small className='opacity-5'>Manage members access</small>
      <div className="heading">
        <h2 className="title">Members</h2>
        <p>{members.length} members</p>
      </div>
      <ul className="members-list no-scrollbar">
        {
          members.map((member, index) => (
            <Member key={index} member={membersMap[member]} />
          ))
        }
      </ul>
    </section>
  )
}

export default MembersList