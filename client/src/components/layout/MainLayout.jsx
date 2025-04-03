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

import { setOrganization, setMembers, setRequests } from '../../redux/features/organizationSlice'
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

  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    // const fetchUserDetails = async () => {
    //   setLoading(true)
    //   const { res, err } = await userApi.getInfo()
    //   if (res?.user) {
    //     dispatch(setUser(res.user))
    //     navigate('/discover')
    //     toast.success('Login successful. Welcome back!')
    //   }
    //   if (err || err === '') {
    //     localStorage.removeItem('token')
    //     navigate('/sign-in')
    //   }
    //   setLoading(false)
    // }

    const fetchUserDetails = () => {
      setLoading(true)
      dispatch(setUser({
        user: {
          userId: "566709d3-9733-4c4f-a7ca-f86c7a6a7d9f",
          name: "Test Test",
          username: "Test_Test2120",
          emails: [
            "test@test.com"
          ],
          role: "USER",
          projectRole: "PRODUCT_OWNER"
        },
        token: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJKb2huX0RvZTIzMzEiLCJpYXQiOjE3NDM2OTA5OTYsImV4cCI6MTc0Mzc3NzM5Nn0.Z-sjLF4fOzHu1af1yPgp7sknIM74NSev7_OIPflDtLY"
      }))
      navigate('/discover')
      toast.success('Login successful. Welcome back!')
      setLoading(false)
    }

    const token = localStorage.getItem('token')

    if (!token) navigate('/sign-in', { replace: true })
    else if (!user) fetchUserDetails()
    else setLoading(false)
  }, [])

  useEffect(() => {
    // const fetchOrganization = async () => {
    //   const { res, err } = await organizationApi.getInfo()
    //   if (res?.organization) {
    //     dispatch(setOrganization(res.organization))
    //     navigate('/dashboard')
    //   }
    //   if (err) navigate('/discover')
    // }

    const fetchOrganization = () => {
      dispatch(setOrganization({
        name: "Test",
        productOwner: "566709d3-9733-4c4f-a7ca-f86c7a6a7d9f",
        stakeholders: [],
        developers: ["8c98d28c-0909-4804-8804-1166af9603f3", "d3fb8ec0-c1a9-4874-b0bb-0ae2c21606a8"],
        testers: ["2e411634-16f3-4f6d-afbb-8aa2a4afc048"],
        managers: ["93cfa0ea-32d5-4b6f-8d48-15cc332746ad"],
        code: "5e0f656"
      }))
      navigate('/dashboard')
    }

    if (user && organization == null) fetchOrganization()
  }, [user])

  useEffect(() => {
    // const fetchMembers = async () => {
    //   const { res, err } = await organizationApi.getMembers()
    //   if (res?.members) dispatch(setMembers(res.members))
    //   if (err) toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')
    // }

    const fetchRequests = async () => {
      const { res, err } = await organizationApi.fetchRequests()
      if (res?.requests) dispatch(setRequests(res.requests))
      if (err) toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')
    }

    // const fetchTeams = async () => {
    //   const { res, err } = await teamsApi.getAll()
    //   if (res?.teams) dispatch(setTeams(res.teams))
    //   if (err) toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')
    // }

    // const fetchProjects = async () => {
    //   const { res, err } = await projectsApi.getAll()
    //   if (res?.projects) dispatch(setProjects(res.projects))
    //   if (err) toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')
    // }

    const fetchMembers = () => {
      dispatch(setMembers([
        {
          userId: "2e411634-16f3-4f6d-afbb-8aa2a4afc048",
          name: "Test Test",
          username: "Test_Test6516",
          emails: ["test4@test.com"],
          role: "USER",
          projectRole: "QA"
        },
        {
          userId: "566709d3-9733-4c4f-a7ca-f86c7a6a7d9f",
          name: "Test Test",
          username: "Test_Test9105",
          emails: ["test@test.com"],
          role: "USER",
          projectRole: "PRODUCT_OWNER"
        },
        {
          userId: "8c98d28c-0909-4804-8804-1166af9603f3",
          name: "Test Test",
          username: "Test_Test2120",
          emails: ["test5@test.com"],
          role: "USER",
          projectRole: "DEVELOPER"
        },
        {
          userId: "d3fb8ec0-c1a9-4874-b0bb-0ae2c21606a8",
          name: "Test Test",
          username: "Test_Test8339",
          emails: ["test3@test.com"],
          role: "USER",
          projectRole: "TEAM_LEAD"
        },
        {
          userId: "93cfa0ea-32d5-4b6f-8d48-15cc332746ad",
          name: "Test Test",
          username: "Test_Test2365",
          emails: ["test1@test.com"],
          role: "USER",
          projectRole: "PROJECT_MANAGER"
        }
      ]))
    }

    const fetchTeams = () => {
      dispatch(setTeams([
        {
          id: "7676ebd1-5221-482d-b7f6-7223d4e89546",
          name: "team1",
          teamLead: "d3fb8ec0-c1a9-4874-b0bb-0ae2c21606a8",
          developers: ["8c98d28c-0909-4804-8804-1166af9603f3","8c98d28c-0909-4804-8804-1166af9603f3","8c98d28c-0909-4804-8804-1166af9603f3","8c98d28c-0909-4804-8804-1166af9603f3","8c98d28c-0909-4804-8804-1166af9603f3","8c98d28c-0909-4804-8804-1166af9603f3","8c98d28c-0909-4804-8804-1166af9603f3","8c98d28c-0909-4804-8804-1166af9603f3","8c98d28c-0909-4804-8804-1166af9603f3","8c98d28c-0909-4804-8804-1166af9603f3","8c98d28c-0909-4804-8804-1166af9603f3","8c98d28c-0909-4804-8804-1166af9603f3","8c98d28c-0909-4804-8804-1166af9603f3","8c98d28c-0909-4804-8804-1166af9603f3","8c98d28c-0909-4804-8804-1166af9603f3", "8c98d28c-0909-4804-8804-1166af9603f3", "8c98d28c-0909-4804-8804-1166af9603f3", "8c98d28c-0909-4804-8804-1166af9603f3", "8c98d28c-0909-4804-8804-1166af9603f3"],
          testers: ["2e411634-16f3-4f6d-afbb-8aa2a4afc048"]
        }
      ]))
    }

    const fetchProjects = () => {
      dispatch(setProjects([
        {
          id: "03f66ba3-4ffa-42bd-b0fb-37b772bc9b63",
          title: "Project1",
          description: "This is description",
          projectManager: "566709d3-9733-4c4f-a7ca-f86c7a6a7d9f",
          teams: [],
          tasksIds: [],
          startDate: "2025-04-03",
          estimatedEndDate: "2025-04-16",
          endDate: null,
          budget: 10000.00,
          completionStatus: "PENDING"
        }
      ]))
    }

    if (organization) {
      fetchMembers()
      fetchRequests()
      fetchTeams()
      fetchProjects()
    }
  }, [organization])

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