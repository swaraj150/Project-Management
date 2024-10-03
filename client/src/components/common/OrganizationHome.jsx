import React from 'react'
import { useSelector } from 'react-redux'

const OrganizationHome = () => {
  const { organization } = useSelector((state) => state.organization)

  return (
    <section className="home">
      <div className="heading">
        <p className='h1'>{organization.name}</p>
        <p>Organization code: <strong>{organization.code}</strong></p>
      </div>
      <div className="grid">
        <div className="main">
          <h2>Management</h2>
          <div className="list">
            {
              organization.productOwner ? (
                <div className="profile paper">
                  <div className="avatar"></div>
                  <div className="info">
                    <strong>{organization.productOwner.name}</strong>
                    <p>{organization.productOwner.projectRole}</p>
                  </div>
                </div>
              ) : null
            }
            {
              organization.projectManager ? (
                <div className="profile paper">
                  <div className="avatar"></div>
                  <div className="info">
                    <strong>{organization.projectManager.name}</strong>
                    <p>{organization.projectManager.projectRole}</p>
                  </div>
                </div>
              ) : null
            }
          </div>
        </div>
        <div className="stakeholders">
          <h2>Stakeholders</h2>
          <div className="list">
            {
              organization.stakeholders?.length === 0 ? (
                <p>No Stakeholder</p>
              ) : (
                organization.stakeholders?.map((item, index) => (
                  <div className="profile paper" key={index}>
                    <div className="avatar"></div>
                    <div className="info">
                      <strong>{item.name}</strong>
                      <p>{item.projectRole}</p>
                    </div>
                  </div>
                ))
              )
            }
          </div>
        </div>
        <div className="members">
          <h2>Members</h2>
          <div className="list no-scrollbar">
            {
              organization.members?.map((item, index) => (
                <div className="profile paper" key={index}>
                  <div className="avatar"></div>
                  <div className="info">
                    <strong>{item.name}</strong>
                    <p>{item.projectRole}</p>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </section>
  )
}

export default OrganizationHome