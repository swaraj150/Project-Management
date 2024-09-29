import React from 'react'
import { useSelector } from 'react-redux'

import OrganizationHero from './OrganizationHero'
import OrganizationInfo from './OrganizationInfo'
import OrganizationHome from './OrganizationHome'

const Organization = () => {
  const { organization } = useSelector((state) => state.organization)

  return (
    <section id="organization">
      {
        organization ? (
          <OrganizationHome />
        ) : (
          <>
            <OrganizationHero />
            <OrganizationInfo />
          </>
        )
      }
    </section>
  )
}

export default Organization