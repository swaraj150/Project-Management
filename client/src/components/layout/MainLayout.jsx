import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'

import userApi from '../../api/modules/user.api'

import { setUser } from '../../redux/features/userSlice'

const MainLayout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user } = useSelector((state) => state.user)

  useEffect(() => {
    const fetchUserDetails = async () => {
      const { res, err } = await userApi.getInfo()

      if (res) {
        dispatch(setUser(res))
        toast.success('Login successful. Welcome back!')
      }

      if (err) navigate('/sign-in')
    }

    if (user === null) fetchUserDetails()
  }, [])

  return (
    <>
      <main>
        <Outlet />
      </main>
    </>
  )
}

export default MainLayout