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
import { putId, setTasks } from '../../redux/features/taskSlice'

import { convertTasksFromServer, segregateTasks } from '../../utils/task.utils'
import { setKanbanTasks } from '../../redux/features/kanbanSlice'

const MainLayout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user } = useSelector((state) => state.user)
  // const { organization } = useSelector((state) => state.organization)

  // useEffect(() => {
  //   const fetchUserDetails = async () => {
  //     const { res, err } = await userApi.getInfo()



  //     if (res) {
  //       dispatch(setUser(res))
  //       toast.success('Login successful. Welcome back!')
  //     }

  //     if (err) {
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
  //     if (err) navigate('/discover')
  //   }
  //   if (user) {
  //     fetchOrganization()
  //   }
  // }, [user])


  // useEffect(() => {


  //   const fetchProjects = async () => {
  //     const { res, err } = await projectsApi.getAll()

  //     if (res) dispatch(setProjects(res))
  //   }

  //   const fetchTeams = async () => {
  //     const { res, err } = await teamsApi.getAll()

  //     if (res) dispatch(setTeams(res))
  //   }

  //   const fetchRequests = async () => {
  //     const { res, err } = await organizationApi.fetchRequests()

  //     if (res) dispatch(setRequests(res))
  //   }

  //   const fetchTasks = async () => {
  //     const { res, err } = await taskApi.fetch()
  //     const { tasks } = res;
  //     console.log(tasks)
  //     if (res && tasks) {
  //       const tasks1 = tasks.map((task, index) => {
  //         const task1 = convertTasksFromServer(task, index + 1, 0,dispatch,null);
  //         return task1;
  //       })
  //       dispatch(setTasks({ tasks: tasks1 }))
  //       const {pending, completed, in_progress} = segregateTasks(tasks1);
  //       dispatch(setKanbanTasks({status:'pending',tasks:pending}))
  //       dispatch(setKanbanTasks({status:'completed',tasks:completed}))
  //       dispatch(setKanbanTasks({status:'in_progress',tasks:in_progress}))
  //     }
  //   }



  //   if (organization) {
  //     fetchProjects()
  //     fetchTeams()
  //     fetchRequests()
  //     fetchTasks()

  //   }
  // }, [organization])

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