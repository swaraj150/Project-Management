import React, { useEffect, useRef, useState } from 'react'
import { MdEdit } from 'react-icons/md'
import { BsPersonFillX } from 'react-icons/bs'

import { isFixedRole } from '../../utils/organization.utils'
import RoleChange from './RoleChange'

const Member = ({ member, isAuthorized }) => {
  const modalRef = useRef(null)

  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) setModalOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  })

  return (
    <li>
      {modalOpen ? <RoleChange member={member} setModalOpen={setModalOpen} modalRef={modalRef} /> : null}
      <div className="member-info">
        <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" alt="" />
        <p>{member.name} &nbsp;&nbsp;
          <a href={`mailto:${member.emails[0]}`} className="opacity-5" >
            {member.emails[0]}
          </a>
        </p>
      </div>
      <div className={`cta ${isAuthorized ? 'authorized' : ''}`}>
        <div className="role" style={isAuthorized ? { justifyContent: "center" } : null}>
          <p className="opacity-5" >{member.projectRole}</p>
          {
            isFixedRole(member.projectRole)
              ? null
              : isAuthorized ? <MdEdit className="opacity-5 pointer" onClick={() => setModalOpen(!modalOpen)} /> : null
          }
        </div>
        {isAuthorized ? <BsPersonFillX className="opacity-5 pointer" /> : null}
      </div>
    </li>
  )
}

export default Member