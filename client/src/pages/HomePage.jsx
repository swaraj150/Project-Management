import React from 'react'
import { useSelector } from 'react-redux'

import MainMenu from '../components/common/MainMenu'
import DashBoard from '../components/common/DashBoard'
import Organization from '../components/common/Organization'
import Teams from '../components/common/Teams'
import Projects from '../components/common/Projects'
import Tasks from '../components/common/Tasks'
import Risks from '../components/common/Risks'

const HomePage = () => {
  const { active, collapsed } = useSelector((state) => state.menu)

  const menuItems = [
    <DashBoard />,
    <Organization />,
    <Projects />,
    <Teams />,
    <Tasks />,
    <Risks />
  ]

  return (
    <section id="homepage">
      <MainMenu />
      <section id="content" className={collapsed ? 'content-spread' : null}>
        {menuItems[active]}
      </section>
    </section>
  )
}

export default HomePage