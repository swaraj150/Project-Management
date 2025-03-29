import React, { useEffect, useState } from 'react'
import { FaSync } from 'react-icons/fa'

import organizationApi from '../../api/modules/organization.api'

import Request from './Request'

const RequestList = () => {
  const [requests, setRequests] = useState([])

  const removeRequest = (requestId) => {
    setRequests((prev) => prev.filter((request) => request.id !== requestId))
  }

  const fetchRequests = async () => {
    setRequests([])
    const { res, err } = await organizationApi.fetchRequests()
    console.log(res.requests)
    if (res?.requests) setRequests(res.requests)
    if (err) toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')
  }

  useEffect(() => {
    fetchRequests()
  }, [])

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
              <Request key={index} request={request} removeRequest={removeRequest} />
            ))
          ) : (
            <p>loading</p>
          )
        }
      </ul>
    </section>
  )
}

export default RequestList