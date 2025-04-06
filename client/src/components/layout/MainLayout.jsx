import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import userApi from '../../api/modules/user.api'
import organizationApi from '../../api/modules/organization.api'
import teamsApi from '../../api/modules/teams.api'
import projectsApi from '../../api/modules/projects.api'
import tasksApi from '../../api/modules/tasks.api'
import metricApi from '../../api/modules/metrics.api'

import { setOrganization, setRequests } from '../../redux/features/organizationSlice'
import { setProjects } from '../../redux/features/projectsSlice'
import { setTeams } from '../../redux/features/teamsSlice'
import { setUser } from '../../redux/features/userSlice'

// import { setCurrentProject } from '../../redux/features/tasksSlice'
// import { setTaskStatusData, setTimeLogData } from '../../redux/features/metricsSlice'
// import { setupTasks } from '../../utils/task.utils'
// import { connectWebSocket } from '../../utils/websocket.utils'

const MainLayout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user } = useSelector((state) => state.user)
  const { organization } = useSelector((state) => state.organization)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
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
        localStorage.removeItem('token')
        navigate('/sign-in')
        setLoading(false)
      }
    }

    if (!user) fetchUserDetails()
  }, [user, dispatch, navigate])

  useEffect(() => {
    const fetchOrganization = async () => {
      const { res, err } = await organizationApi.getInfo()
      if (res?.organization) {
        dispatch(setOrganization(res.organization))
      } else {
        navigate('/discover')
        setLoading(false)
      }
    }

    if (user && organization === null) fetchOrganization()
  }, [user, organization, dispatch, navigate])

  useEffect(() => {
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
      if (res?.projects) dispatch(setProjects(res.projects))
      if (err) toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')
    }

    const fetchData = async () => {
      await Promise.all([fetchRequests(), fetchTeams(), fetchProjects()])
      setLoading(false)
    }

    if (organization) {
      fetchData()
    }
  }, [organization, dispatch])

  // useEffect(() => {
  //   const fetchTasks = async () => {
  //     const { res, err } = await tasksApi.fetchByProject(projects[0].id)

  //     if (res?.tasks) {
  //       setupTasks(res.tasks, dispatch);
  //       dispatch(setCurrentProject(projects[0]))
  //     }

  //     if (err) toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')
  //   }

  //   const fetchMetrics = async () => {
  //     const { res, err } = await metricApi.load(projects[0].id)
  //     const taskStatusData={
  //       name:"Pending Tasks",value:res[pendingTasks],
  //       name:"In Progress Tasks",value:res[in_progressTasks],
  //       name:"Completed Tasks",value:res[completedTasks],
  //     };
  //     const timeLogData={
  //       category:"Total Timelogs",value:res[timeLogs],
  //       category:"Estimated Time",value:res[estimatedTime],
  //     };

  //     dispatch(setTimeLogData(timeLogData))
  //     dispatch(setTaskStatusData(taskStatusData))

  //   }
  //   if (projects) {
  //     fetchTasks();
  //     fetchMetrics();
  //   }
  // }, [projects])

  // useEffect(() => {
  //   const webSocketUrl = import.meta.env.VITE_WEBSOCKET_URL;
  //   dispatch(connectWebSocket(webSocketUrl + '/ws', localStorage.getItem('token')));
  //   return () => {
  //     dispatch(disonnectWebSocket(client))
  //   }
  // }, [dispatch])

  return (
    <main>
      {
        loading ? <p>Loading...</p> : <Outlet />
      }
    </main>
  )
}

export default MainLayout