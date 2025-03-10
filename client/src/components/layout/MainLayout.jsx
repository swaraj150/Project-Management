import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import organizationApi from '../../api/modules/organization.api'
import projectsApi from '../../api/modules/projects.api'
import teamsApi from '../../api/modules/teams.api'
import userApi from '../../api/modules/user.api'

import { setOrganization, setRequests } from '../../redux/features/organizationSlice'
import { setProjects } from '../../redux/features/projectsSlice'
import { setTeams } from '../../redux/features/teamsSlice'
import { setUser } from '../../redux/features/userSlice'
import taskApi from '../../api/modules/task.api'
import { setCurrentProject } from '../../redux/features/taskSlice'
import metricApi from '../../api/modules/metrics.api'
import { setTaskStatusData, setTimeLogData } from '../../redux/features/metricsSlice'
import { setupTasks } from '../../utils/task.utils'
import { connectWebSocket } from '../../utils/websocket.utils'



const MainLayout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user } = useSelector((state) => state.user)
  const { organization } = useSelector((state) => state.organization)
  const { projects } = useSelector((state) => state.projects);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const { res, err } = await userApi.getInfo()
      console.log(res)
      console.log(err)
      if (res) {
        dispatch(setUser(res))
        toast.success('Login successful. Welcome back!')
      }else{
        localStorage.removeItem('token')
        navigate('/sign-in')
      }

      // if (err) {
        // localStorage.removeItem('token')
        // navigate('/sign-in')
        
      // }
    }

    const token = localStorage.getItem('token')

    if (user == null && token === null) navigate('/sign-in')
    if (user === null) fetchUserDetails()
  }, [])

  useEffect(() => {
    const fetchOrganization = async () => {
      const { res, err } = await organizationApi.getInfo()

      if (res) dispatch(setOrganization(res))
      if (err) navigate('/discover')
    }
    if (user) {
      fetchOrganization()
    }
  }, [user])


  useEffect(() => {


    const fetchProjects = async () => {
      const { res, err } = await projectsApi.getAll()

      if (res) dispatch(setProjects(res))
    }

    const fetchTeams = async () => {
      const { res, err } = await teamsApi.getAll()

      if (res) dispatch(setTeams(res))
    }

    const fetchRequests = async () => {
      const { res, err } = await organizationApi.fetchRequests()

      if (res) dispatch(setRequests(res))
    }





    if (organization) {
      fetchProjects()
      fetchTeams()
      fetchRequests()
    }


  }, [organization])


  useEffect(() => {
    const fetchTasks = async () => {
      const { res, err } = await taskApi.fetchByProject(projects[0].id)
      const { tasks } = res;
      console.log("tasks", tasks)
      if (res && tasks) {
        setupTasks(tasks, dispatch);
        dispatch(setCurrentProject(projects[0]))
      }

    }
    const fetchMetrics = async () => {
      const { res, err } = await metricApi.load(projects[0].id)
      // const taskStatusData={
      //   name:"Pending Tasks",value:res[pendingTasks],
      //   name:"In Progress Tasks",value:res[in_progressTasks],
      //   name:"Completed Tasks",value:res[completedTasks],
      // };
      // const timeLogData={
      //   category:"Total Timelogs",value:res[timeLogs],
      //   category:"Estimated Time",value:res[estimatedTime],
      // };

      // dispatch(setTimeLogData(timeLogData))
      // dispatch(setTaskStatusData(taskStatusData))

    }
    if (projects) {
      fetchTasks();
      // fetchMetrics();
    }
  }, [projects])
  useEffect(() => {

    const webSocketUrl = import.meta.env.VITE_WEBSOCKET_URL;
    dispatch(connectWebSocket(webSocketUrl + '/ws', localStorage.getItem('token')));

    // return () => {
    //   dispatch(disonnectWebSocket(client))
    // }
  }, [dispatch])

  return (
    <>
      <main className='no-scrollbar'>
        {user && <Outlet />}
        {/* <Outlet /> */}
      </main>
    </>
  )
}

export default MainLayout