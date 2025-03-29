import React from 'react'
import { useSelector } from 'react-redux'

import Menu from '../components/common/Menu'

const Dashboard = () => {
  const { collapsed } = useSelector((state) => state.menu)

  return (
    <section id="dashboard">
      <Menu />
      <section className={`content ${collapsed ? "expanded" : null}`} >
        
      </section>
    </section>
  )
}

export default Dashboard
