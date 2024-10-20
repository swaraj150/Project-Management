import React from 'react'
import { useSelector } from 'react-redux'

import Request from './Request'


const RequestList = () => {
  const { requests } = useSelector((state) => state.organization)

  return (
    <section className="requests">
      <small className='opacity-5'>Manage joining requests</small>
      <div className="heading">
        <h2 className="title">Requests</h2>
        <p>{requests.length} requests</p>
      </div>
      <ul className="requests-list no-scrollbar">
        {
          requests.map((request, index) => (
            <Request key={index} request={request}/>
          ))
        }
      </ul>
    </section>
  )
}

export default RequestList