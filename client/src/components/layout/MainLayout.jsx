import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import userApi from '../../api/modules/user.api'
import organizationApi from '../../api/modules/organization.api'
import teamsApi from '../../api/modules/teams.api'
import projectsApi from '../../api/modules/projects.api'
import tasksApi from '../../api/modules/tasks.api'
import chatsApi from '../../api/modules/chats.api'

import { useSocket } from '../../contexts/SocketContext'
import { ProjectProvider } from '../../contexts/ProjectContext'

import { setUser } from '../../redux/features/userSlice'
import { setOrganization, setRequests } from '../../redux/features/organizationSlice'
import { setTeams } from '../../redux/features/teamsSlice'
import { addProject, setProjects } from '../../redux/features/projectsSlice'
import { setTasks } from '../../redux/features/tasksSlice'
import { setChats } from '../../redux/features/chatsSlice'

import { roles } from '../../utils/organization.utils'

const MainLayout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user } = useSelector((state) => state.user)
  const { organization } = useSelector((state) => state.organization)
  const { projects } = useSelector((state) => state.projects)
  const { tasks } = useSelector((state) => state.tasks)

  const { subscribeToChat, subscribeToTaskUpdates, sendMessageInChat } = useSocket()

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) return

    const fetchUserDetails = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/sign-in', { replace: true })
        setLoading(false)
        return
      }

      const { res, err } = await userApi.getInfo()
      if (res?.user) {
        dispatch(setUser(res.user))
        toast.success('Login successful. Welcome back!')
      } else {
        if (err) toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')
        localStorage.removeItem('token')
        navigate('/sign-in')
        setLoading(false)
      }
    }

    fetchUserDetails()
  }, [user, dispatch, navigate])

  useEffect(() => {
    if (!user || organization) return

    const fetchOrganization = async () => {
      const { res, err } = await organizationApi.getInfo()
      if (res?.organization) {
        dispatch(setOrganization(res.organization))
      } else {
        if (err) toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')
        navigate('/discover')
        setLoading(false)
      }
    }

    fetchOrganization()
  }, [user, organization, dispatch, navigate])

  useEffect(() => {
    if (!organization) return

    const fetchRequests = async () => {
      const { res, err } = await organizationApi.fetchRequests()
      if (res?.requests) dispatch(setRequests(res.requests))
      if (err) toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')
    }

    const fetchTeams = async () => {
      const { res, err } = await teamsApi.getAll()
      if (res?.teams) dispatch(setTeams(res.teams))
      if (err) toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')
    }

    const fetchProjects = async () => {
      const { res, err } = await projectsApi.getAll()
      if (res?.projects) {
        if (user.projectRole === roles.productOwner) dispatch(setProjects(res.projects))
        else dispatch(addProject(res.projects))
      }
      if (err) toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')
    }

    const fetchTasks = async () => {
      const { res, err } = await tasksApi.getAll()
      if (res?.tasks) dispatch(setTasks(res.tasks))
      if (err) toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')
    }

    const fetchChats = async () => {
      const { res, err } = await chatsApi.getAll()
      if (user.projectRole === roles.productOwner) {
        if (res.organizationChats && res.projectChats) dispatch(setChats(res))
      } else {
        if (res.organizationChats && res.projectChats && res.taskChats) dispatch(setChats(res))
      }
      if (err) toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')
    }

    const fetchData = async () => {
      if (user.projectRole === roles.productOwner) await Promise.all([fetchRequests(), fetchTeams(), fetchProjects(), fetchTasks(), fetchChats()])
      else await Promise.all([fetchTeams(), fetchProjects(), fetchTasks(), fetchChats()])
      setLoading(false)
    }

    fetchData()
    const organizationChatSubscription = subscribeToChat({ id: organization.id })

    return () => {
      if (organizationChatSubscription) organizationChatSubscription.unsubscribe()
    }
  }, [organization, dispatch])

  // useEffect(() => {
  //   if (projects) {
  //     const chatSubscriptions = projects.forEach((projectId) => subscribeToProjectChat({ projectId }))
  //     sendMessageInProjectChat({ projectId: projects[0], payload: { message: "hello" } })
  //     return () => {
  //       if (chatSubscriptions) chatSubscriptions.forEach((subscription) => subscription.unsubscribe())
  //     }
  //   }
  // }, [projects])

  // useEffect(() => {
  //   if (tasks) {
  //     const chatSubscriptions = tasks.forEach((taskId) => subscribeToTaskChat({ taskId }))
  //     const updateSubscriptions = tasks.forEach((taskId) => subscribeToTaskUpdates({ taskId }))
  //     return () => {
  //       if (chatSubscriptions) chatSubscriptions.forEach((subscription) => subscription.unsubscribe())
  //       if (updateSubscriptions) updateSubscriptions.forEach((subscription) => subscription.unsubscribe())
  //     }
  //   }
  // }, [tasks])

  return (
    <main>
      <ProjectProvider>
        {loading ? <p>Loading...</p> : user && <Outlet />}
      </ProjectProvider>
    </main>
  )
}

export default MainLayout