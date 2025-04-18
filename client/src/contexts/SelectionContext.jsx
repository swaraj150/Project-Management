import { createContext, useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import tasksApi from '../api/modules/tasks.api'

import { updateTask } from '../redux/features/tasksSlice'

const SelectionContext = createContext(null)

export const SelectionProvider = ({ children }) => {
  const dispatch = useDispatch()

  const { memebersMap } = useSelector((state) => state.organization)
  const { teamsMap } = useSelector((state) => state.teams)
  const { projectsMap } = useSelector((state) => state.projects)
  const { tasksMap } = useSelector((state) => state.tasks)

  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [selectedProject, setSelectedProject] = useState(null)
  const [selectedTask, setSelectedTask] = useState(null)
  const [parentTaskId, setParentTaskId] = useState(null)
  const [taskViewMode, setTaskViewMode] = useState(0)

  const handleUpdateTask = async (task) => {
    const { res, err } = await tasksApi.update({ ...task })
    if (res.task) {
      dispatch(updateTask(res.task))
      toast.success('Task updated successfully!')
    }
    if (err) toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')
  }

  useEffect(() => {
    if (memebersMap && selectedUser) setSelectedUser(memebersMap[selectedUser.userId])
  }, [memebersMap, selectedUser])

  useEffect(() => {
    if (teamsMap && selectedTeam) setSelectedTeam(teamsMap[selectedTeam.id])
  }, [teamsMap, selectedTeam])

  useEffect(() => {
    if (projectsMap && selectedProject) setSelectedProject(projectsMap[selectedProject.id])
  }, [projectsMap, selectedProject])

  useEffect(() => {
    if (tasksMap && selectedTask) setSelectedTask(tasksMap[selectedTask.id])
  }, [tasksMap, selectedTask])

  return (
    <SelectionContext.Provider
      value={{ 
        selectedUser,
        setSelectedUser,
        selectedTeam, 
        setSelectedTeam, 
        selectedProject, 
        setSelectedProject, 
        selectedTask, 
        setSelectedTask, 
        parentTaskId, 
        setParentTaskId,
        taskViewMode,
        setTaskViewMode,
        handleUpdateTask
      }}
    >
      {children}
    </SelectionContext.Provider>
  )
}

export const useSelection = () => {
  const context = useContext(SelectionContext)
  return context
}