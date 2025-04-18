import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { BsPersonFillX } from 'react-icons/bs'

import organizationApi from '../../api/modules/organization.api'

import { useSelection } from '../../contexts/SelectionContext'

import { removeMember } from '../../redux/features/organizationSlice'

import { roles, rolesMap } from '../../utils/organization.utils'

const Member = ({ member }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user } = useSelector((state) => state.user)

  const { setSelectedUser } = useSelection()

  const handleRemove = async () => {
    const { res, err } = await organizationApi.remove({ memberId: member.userId })
    if (res) {
      dispatch(removeMember(member))
      toast.success('Member removed successfully!')
    }
    if (err) toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')
  }

  const viewProfile = () => {
    setSelectedUser(member)
    navigate(`/profile/${member.username}`)
  }

  return (
    <li>
      <div className="member-info">
        <img className='profile-img' src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" alt="" />
        <p>
          <span className='pointer' onClick={viewProfile}>{member.username}</span> 
          &nbsp;&nbsp;
          <a href={`mailto:${member.emails[0]}`} className="opacity-5" >
            {member.emails[0]}
          </a>
        </p>
      </div>
      <div className={`cta opacity ${user.projectRole === roles.productOwner ? 'authorized' : ''}`}>
        <p className="role" >{rolesMap[member.projectRole]}</p>
        {user.projectRole === roles.productOwner ? <BsPersonFillX className="pointer" onClick={handleRemove} /> : null}
      </div>
    </li>
  )
}

export default Member