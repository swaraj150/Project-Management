import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaSync } from 'react-icons/fa'

import organizationApi from '../../api/modules/organization.api'

import Request from './Request'

import { setRequests } from '../../redux/features/organizationSlice'

const RequestList = () => {
  const dispatch = useDispatch()

  const { requests } = useSelector((state) => state.organization)

  const [dataRequested, setDataRequested] = useState(false)

  const fetchRequests = async () => {
    setDataRequested(true)
    const { res, err } = await organizationApi.fetchRequests()
    if (res?.requests) {
      dispatch(setRequests(res.requests))
      setDataRequested(false)
    }
    if (err) {
      toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')
      setDataRequested(false)
    }
  }

  return (
    <section className='requests'>
      <small className='opacity-5'>Manage joining requests</small>
      <div className='heading'>
        <h2 className='title'>Requests</h2>
        <div>
          <FaSync className='pointer' onClick={fetchRequests} />
          <p>{requests.length} requests</p>
        </div>
      </div>
      <ul className='requests-list no-scrollbar'>
        {
          requests.length !== 0 ? (
            requests.map((request, index) => (
              <Request key={index} request={request} />
            ))
          ) : (
            dataRequested ? <p>Loading...</p> : <p>No pending requests</p>
          )
        }
    </ul>
    </section >
  )
}

export default RequestList