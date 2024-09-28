import React, { useState } from 'react'

import MainMenu from '../components/common/MainMenu'
import DashBoard from '../components/common/DashBoard'
import Organization from '../components/common/Organization'
import Projects from '../components/common/Projects'
import Tasks from '../components/common/Tasks'
import Alerts from '../components/common/Alerts'

const HomePage = () => {
  const [active, setActive] = useState(0)

  const menuItems = [
    <DashBoard />,
    <Organization />,
    <Projects />,
    <Tasks />,
    <Alerts />
  ]

  return (
    <section id="homepage">
      <MainMenu active={active} setActive={setActive} />
      <section className="content">
        {menuItems[active]}
      </section>
    </section>
  )
}

export default HomePage