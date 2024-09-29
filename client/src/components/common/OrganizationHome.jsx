import React from 'react'
import { useSelector } from 'react-redux'

const OrganizationHome = () => {
  const { organization } = useSelector((state) => state.organization)

  return (
    <section className="home">
      <p className='h1'>{organization.name}</p>
      <p>Organization code: <strong>{organization.code}</strong></p>
      <div className="grid">
        <div className="main">
          <div className="profile paper">
            <div className="avatar"></div>
            <div className="info">
              <h3>{organization.productOwner.name}</h3>
              <p>{organization.productOwner.projectRole}</p>
            </div>
          </div>
          <div className="profile paper">
            <div className="avatar"></div>
            <div className="info">
              <h3>{organization.projectManager.name}</h3>
              <p>{organization.projectManager.projectRole}</p>
            </div>
          </div>
        </div>
        <div className="stakeholders">
          {
            organization?.stakeholders?.map((item, index) => (
              <div className="profile paper" key={index}>
                <div className="avatar"></div>
                <div className="info">
                  <h3>{item.name}</h3>
                  <p>{item.projectRole}</p>
                </div>
              </div>
            ))
          }
        </div>
        <div className="members no-scrollbar">
          {
            organization?.members?.map((item, index) => (
              <div className="profile paper" key={index}>
                <div className="avatar"></div>
                <div className="info">
                  <h3>{item.name}</h3>
                  <p>{item.projectRole}</p>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </section>
  )
}

export default OrganizationHome