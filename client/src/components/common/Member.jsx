import React from 'react'
import { useSelector } from 'react-redux'
import { BsPersonFillX } from 'react-icons/bs'

import { roles } from '../../utils/organization.utils'

const Member = ({ member }) => {
  const { user } = useSelector((state) => state.user)

  return (
    <li>
      <div className="member-info">
        <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" alt="" />
        <p>{member.username} &nbsp;&nbsp;
          {/* <a href={`mailto:${member.emails[0]}`} className="opacity-5" >
            {member.emails[0]}
          </a> */}
        </p>
      </div>
      <div className={`cta opacity ${user.projectRole === roles.productOwner ? 'authorized' : ''}`}>
        <p className="role" >{member.projectRole}</p>
        {user.projectRole === roles.productOwner ? <BsPersonFillX className="pointer" /> : null}
      </div>
    </li>
  )
}

export default Member