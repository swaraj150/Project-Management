import React, { useEffect, useRef, useState } from 'react'
import { BsPersonFillX } from 'react-icons/bs'

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
      <div className="member-info">
        <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" alt="" />
        <p>{member.name} &nbsp;&nbsp;
          <a href={`mailto:${member.emails[0]}`} className="opacity-5" >
            {member.emails[0]}
          </a>
        </p>
      </div>
      <div className={`cta opacity ${isAuthorized ? 'authorized' : ''}`}>
        <p className="role" >{member.projectRole}</p>
        {isAuthorized ? <BsPersonFillX className="pointer" /> : null}
      </div>
    </li>
  )
}

export default Member