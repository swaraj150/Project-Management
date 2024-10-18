import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import Member from './Member'

import { authorizedUser } from '../../utils/organization.utils'

const MembersList = ({ members }) => {
  const { user } = useSelector((state) => state.user)

  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    setIsAuthorized(authorizedUser(user))
  }, [user])

  return (
    <ul className="members-list no-scrollbar">
      {
        members.map((member, index) => (
          <Member key={index} member={member} isAuthorized={isAuthorized} />
        ))
      }
    </ul>
  )
}

export default MembersList