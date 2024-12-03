import React from 'react'
import { useSelector } from 'react-redux'

import Menu from '../components/common/Menu'
import DashBoard from './DashBoard'
import Organization from './Organization'
import Teams from './Teams'
import Projects from './Projects'
import Tasks from './Tasks'
import Kanban from './Kanban'
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const HomePage = () => {
  const { active, collapsed } = useSelector((state) => state.menu)

  const menuItems = [
    <DashBoard />,
    <Organization />,
    <Teams />,
    <Projects />,
    <DndProvider backend={HTML5Backend}>
      <Kanban />
    </DndProvider>
  ]

  return (
    <section id="homepage">
      <Menu />
      <section id="content" className={`no-scrollbar ${collapsed ? "expanded" : null}`} >
        {menuItems[active]}
      </section>
    </section>
  )
}

export default HomePage