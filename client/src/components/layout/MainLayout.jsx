import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import organizationApi from '../../api/modules/organization.api'
import userApi from '../../api/modules/user.api'

import { setOrganization } from '../../redux/features/organizationSlice'
import { setUser } from '../../redux/features/userSlice'

const MainLayout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user } = useSelector((state) => state.user)

  useEffect(() => {
    const fetchOrganization = async () => {
      const { res, err } = await organizationApi.getInfo()

      if (res) dispatch(setOrganization(res))
    }

    const fetchUserDetails = async () => {
      const { res, err } = await userApi.getInfo()

      if (res) {
        dispatch(setUser(res))
        toast.success('Login successful. Welcome back!')
        fetchOrganization()
      } else {
        localStorage.removeItem('token')
        navigate('/sign-in')
      }
    }

    const token = localStorage.getItem('token')

    if (token && user === null) fetchUserDetails()
  }, [])

  return (
    <>
      <main className='no-scrollbar'>
        { user && <Outlet /> }
      </main>
    </>
  )
}

export default MainLayout