import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Menu from '../components/common/Menu'
import DashBoard from './DashBoard'
import Organization from './Organization'
import Teams from './Teams'
import Projects from './Projects'
import Tasks from './Tasks'
import ProjectTasks from '../components/common/ProjectTasks'
import { toggleProjectTaskModal } from '../redux/features/taskSlice'

const HomePage = () => {
  const { active, collapsed } = useSelector((state) => state.menu)
  const projectTaskModal=useSelector((state)=>state.task.projectTaskModal); 
  const menuItems = [
    <DashBoard />,
    <Organization />,
    <Teams />,
    <Projects />,
    <Tasks />
  ]



  return (
    <section id="homepage">
      <Menu />
      <section id="content" className={`no-scrollbar ${collapsed ? "expanded" : null}`} >
        {
        menuItems[active]        
        }
        {projectTaskModal && <ProjectTasks/>}
      </section>
    </section>
  )
}

export default HomePage