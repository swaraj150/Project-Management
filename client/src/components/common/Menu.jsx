import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { MdDashboard, MdGroups, MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md"
import { FaBuilding, FaProjectDiagram, FaRocketchat, FaTasks } from "react-icons/fa"

import Logo from '../../assets/logo.png'

import { setActive, setCollapsed } from '../../redux/features/menuSlice'
// import { toggleProjectTaskModal } from '../../redux/features/tasksSlice'

const menuItems = [
  {
    name: 'DashBoard',
    icon: <MdDashboard />,
    path: '/dashboard'
  },
  {
    name: 'Organization',
    icon: <FaBuilding />,
    path: '/organization'
  },
  {
    name: 'Teams',
    icon: <MdGroups />,
    path: '/teams'
  },
  {
    name: 'Projects',
    icon: <FaProjectDiagram />,
    path: '/projects'
  },
  {
    name: 'Tasks',
    icon: <FaTasks />,
    path: '/tasks'
  },
  {
    name: 'ChatSection',
    icon: <FaRocketchat />,
    path: '/chat'
  },
  {
    name: 'Reference',
    icon: <FaProjectDiagram />,
    path: '/reference'
  }
]

const Menu = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { active, collapsed } = useSelector((state) => state.menu)

  const handleChange = (index) => {
    dispatch(setActive(index))
    navigate(menuItems[index].path)
  }

  return (
    <section id="menu" className={collapsed ? "collapsed" : null} >
      <div className="collapse-btn pointer paper-1" onClick={() => dispatch(setCollapsed(!collapsed))}>
        {
          collapsed ? <MdOutlineKeyboardArrowRight /> : <MdOutlineKeyboardArrowLeft />
        }
      </div>
      <div className="menu-title">
        <img src={Logo} alt="logo" />
        {
          collapsed ? null : <p>Project Maestro</p>
        }
      </div>
      <ul className="menu-items">
        {
          menuItems.map((item, index) => (
            <li key={index} className={active === index ? "active pointer paper" : "pointer"}
              onClick={() => {
                handleChange(index)
                // if (index == 4) {
                //   dispatch(toggleProjectTaskModal())
                // }
              }}>
              {item.icon} {collapsed ? null : item.name}
            </li>
          ))
        }
      </ul>
      <ul className="menu-user-settings">

      </ul>
    </section>
  )
}

export default Menu