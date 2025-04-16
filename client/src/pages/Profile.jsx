import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Menu from '../components/common/Menu'

import { setActive } from '../redux/features/menuSlice'

import { menuIndices } from '../utils/menu.utils'

const Profile = () => {
  const dispatch = useDispatch()

  const { collapsed } = useSelector((state) => state.menu)

  useEffect(() => {
    dispatch(setActive(menuIndices.organization))
  }, [])

  return (
    <section id='profile'>
      <Menu />
      <section className={`content ${collapsed ? 'expanded' : null}`} >

      </section>
    </section>
  )
}

export default Profile