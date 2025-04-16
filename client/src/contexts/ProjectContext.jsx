import { createContext, useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import tasksApi from '../api/modules/tasks.api'

import { updateTask } from '../redux/features/tasksSlice'

const ProjectContext = createContext(null)

export const ProjectProvider = ({ children }) => {
  const dispatch = useDispatch()

  const { teamsMap } = useSelector((state) => state.teams)
  const { projectsMap } = useSelector((state) => state.projects)
  const { tasksMap } = useSelector((state) => state.tasks)

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
    if (selectedTeam) setSelectedTeam(teamsMap[selectedTeam.id])
  }, [teamsMap])

  useEffect(() => {
    if (selectedProject) setSelectedProject(projectsMap[selectedProject.id])
  }, [projectsMap])

  useEffect(() => {
    if (selectedTask) setSelectedTask(tasksMap[selectedTask.id])
  }, [tasksMap])

  return (
    <ProjectContext.Provider
      value={{ 
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
    </ProjectContext.Provider>
  )
}

export const useProject = () => {
  const context = useContext(ProjectContext)
  return context
}