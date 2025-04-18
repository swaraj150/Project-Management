import React from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { HiCheckCircle } from 'react-icons/hi2'
import { TiDelete } from 'react-icons/ti'

import organizationApi from '../../api/modules/organization.api'

import { addMember, removeRequest } from '../../redux/features/organizationSlice'

const Request = ({ request }) => {
  const dispatch = useDispatch()

  const handleReject = async () => {
    const { res, err } = await organizationApi.reject({ requestId: request.id })
    if (res){
      dispatch(removeRequest({ requestId: request.id }))
      toast.success(`${request.username} has been successfully rejected!`)
    }
    if (err) toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')
  }

  const handleAccept = async () => {
    const { res, err } = await organizationApi.accept({ requestId: request.id })
    if (res?.user) {
      dispatch(addMember(res.user))
      dispatch(removeRequest({ requestId: request.id }))
      toast.success(`${request.username} has been successfully accepted!`)
    }
    if (err) toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')
  }

  return (
    <li>
      <div className="request-info">
        <img className='profile-img' src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" alt="" />
        <p>{request.username}</p>
      </div>
      <div className="cta">
        <p className="role">{request.projectRole}</p>
        <div className="cta-button pointer" onClick={handleAccept}>
          <HiCheckCircle />
          <p>Accept</p>
        </div>
        <div className="cta-button pointer" onClick={handleReject}>
          <TiDelete />
          <p>Reject</p>
        </div>
      </div>
    </li>
  )
}

export default Request