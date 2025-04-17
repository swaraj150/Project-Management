import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { MdDashboard, MdGroups, MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from 'react-icons/md'
import { FaBuilding, FaProjectDiagram, FaTasks } from 'react-icons/fa'
import { IoMdChatboxes } from 'react-icons/io'
import { CiLogout } from 'react-icons/ci'

import userApi from '../../api/modules/user.api'

import Logo from '../../assets/logo.png'

import { useSelection } from '../../contexts/SelectionContext'

import { setActive, setCollapsed } from '../../redux/features/menuSlice'
import { setUser } from '../../redux/features/userSlice'

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
    name: 'Chats',
    icon: <IoMdChatboxes />,
    path: '/chats'
  },
  {
    name: 'Your Profile',
    icon: <img className='profile-img' src='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png' alt='' />,
    path: '/profile/me'
  }
]

const Menu = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { active, collapsed } = useSelector((state) => state.menu)
  const { user } = useSelector((state) => state.user)

  const { setSelectedUser } = useSelection()

  const handleChange = (index) => {
    dispatch(setActive(index))
    navigate(menuItems[index].path)
  }

  const handleLogout = async () => {
    const { res, err } = await userApi.logout()
    if (res) {
      localStorage.removeItem('token')
      dispatch(setUser(null))
      toast.success('You have successfully logged out.')
    }
    if (err) toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')
  }

  return (
    <section id='menu' className={collapsed ? 'collapsed' : null} >
      <div className='collapse-btn pointer paper-1' onClick={() => dispatch(setCollapsed(!collapsed))}>
        {collapsed ? <MdOutlineKeyboardArrowRight /> : <MdOutlineKeyboardArrowLeft />}
      </div>
      <div className='menu-title'>
        <img src={Logo} alt='logo' />
        {collapsed ? null : <p>Project Maestro</p>}
      </div>
      <ul className='menu-items'>
        {
          menuItems.slice(0, 6).map((item, index) => (
            <li
              key={index}
              className={`pointer ${active === index ? 'active paper' : null}`}
              onClick={() => handleChange(index)}
            >
              {item.icon} {collapsed ? null : item.name}
            </li>
          ))
        }
      </ul>
      <ul className='menu-user-settings'>
        <div
          className={`profile pointer ${active === 6 ? 'active paper' : null}`}
          onClick={() => {
            setSelectedUser(user)
            handleChange(6)
          }}
        >
          {menuItems[6].icon}
          {collapsed ? null : <p>{menuItems[6].name}</p>}
        </div>
        <div className="logout pointer" onClick={handleLogout}>
          <CiLogout />
          {collapsed ? null : <p>Logout</p>}
        </div>
      </ul>
    </section>
  )
}

export default Menu