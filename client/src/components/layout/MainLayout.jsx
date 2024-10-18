import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import organizationApi from '../../api/modules/organization.api'
import projectsApi from '../../api/modules/projects.api'
import teamsApi from '../../api/modules/teams.api'
import userApi from '../../api/modules/user.api'

import { setOrganization } from '../../redux/features/organizationSlice'
import { setProjects } from '../../redux/features/projectsSlice'
import { setTeams } from '../../redux/features/teamsSlice'
import { setUser } from '../../redux/features/userSlice'

const MainLayout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user } = useSelector((state) => state.user)

  // useEffect(() => {
  //     const fetchUserDetails = async () => {
  //     const { res, err } = await userApi.getInfo()

  //     if (res) {
  //       dispatch(setUser(res))
  //       toast.success('Login successful. Welcome back!')
  //     } else {
  //       localStorage.removeItem('token')
  //       navigate('/sign-in')
  //     }
  //   }

  //   const token = localStorage.getItem('token')

  //   if (user == null && token === null) navigate('/sign-in')
  //   if (user === null) fetchUserDetails()
  // }, [])

  // useEffect(() => {
  //   const fetchOrganization = async () => {
  //     const { res, err } = await organizationApi.getInfo()

  //     if (res) dispatch(setOrganization(res))
  //   }

  //   const fetchProjects = async () => {
  //     const { res, err } = await projectsApi.getAll()

  //     if (res) dispatch(setProjects(res))
  //   }

  //   const fetchTeams = async () => {
  //     const { res, err } = await teamsApi.getAll()

  //     if (res) dispatch(setTeams(res))
  //   }

  //   if (user) {
  //     fetchOrganization()
  //     fetchProjects()
  //     fetchTeams()
  //   }
  // }, [user])

  return (
    <>
      <main className='no-scrollbar'>
        {/* { user && <Outlet /> } */}
        <Outlet />
      </main>
    </>
  )
}

export default MainLayout