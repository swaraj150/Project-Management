import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MdDashboard } from 'react-icons/md'
import { FaBuilding, FaProjectDiagram, FaTasks } from 'react-icons/fa'
import { IoIosAlert } from 'react-icons/io'
import { MdLightMode, MdDarkMode, MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md'

import { setActive, setCollapsed } from '../../redux/features/menuSlice'

const MainMenu = () => {
  const dispatch = useDispatch()

  const { active, collapsed } = useSelector((state) => state.menu)

  const menuItems = [
    { icon: <MdDashboard />, label: 'Dashboard' },
    { icon: <FaBuilding />, label: 'Organization' },
    { icon: <FaProjectDiagram />, label: 'Projects' },
    { icon: <FaTasks />, label: 'Tasks' },
    { icon: <IoIosAlert />, label: 'Alerts' }
  ]

  return (
    <section className={collapsed ? 'main-menu collapsed' : 'main-menu'}>
      <div className="menu-collapse pointer" onClick={() => dispatch(setCollapsed(!collapsed))}>
        {
          collapsed ? <MdKeyboardArrowRight /> : <MdKeyboardArrowLeft />
        }
      </div>
      <ul>
        {
          menuItems?.map((item, index) => (
            <div className={active === index ? 'active pointer' : 'pointer'} key={index} >
              <span className='top-curve'></span>
              <li onClick={() => dispatch(setActive(index))}>
                {item.icon}
                <span>{item.label}</span>
              </li>
              <span className='bottom-curve'></span>
            </div>
          ))
        }
      </ul>
    </section>
  )
}

export default MainMenu
