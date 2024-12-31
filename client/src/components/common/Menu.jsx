import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MdDashboard, MdGroups, MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md"
import { FaBuilding, FaProjectDiagram, FaTasks } from "react-icons/fa"

import Logo from '../../assets/logo.png'

import { setActive, setCollapsed } from '../../redux/features/menuSlice'
import { toggleProjectTaskModal } from '../../redux/features/taskSlice'

const menuItems = [
  {
    name: 'DashBoard',
    icon: <MdDashboard />
  },
  {
    name: 'Organization',
    icon: <FaBuilding />
  },
  {
    name: 'Teams',
    icon: <MdGroups />
  },
  {
    name: 'Projects',
    icon: <FaProjectDiagram />
  },
  {
    name: 'Tasks',
    icon: <FaTasks />
  }
]

const Menu = () => {
  const dispatch = useDispatch()

  const { collapsed } = useSelector((state) => state.menu)

  const [selected, setSelected] = useState(0)

  const handleChange = (index) => {
    setSelected(index)
    dispatch(setActive(index))
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
            <li key={index} className={selected === index ? "active pointer paper" : "pointer" } 
            onClick={() => {
              handleChange(index)
              if(index==4){
                dispatch(toggleProjectTaskModal());
              }
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