import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Select from 'react-select'
import { IoMdAdd } from 'react-icons/io'
import { LuGanttChartSquare } from 'react-icons/lu'
import { MdOutlineViewKanban } from 'react-icons/md'

import tasksApi from '../api/modules/tasks.api'

import Menu from '../components/common/Menu'
import GanttChart from '../components/common/GanttChart'
import KanbanBoard from '../components/common/KanbanBoard'

import { setActive } from '../redux/features/menuSlice'
import { setTasks } from '../redux/features/tasksSlice'

import { menuIndices } from '../utils/menu.utils'
import { roles } from '../utils/organization.utils'
import { extendTask } from '../utils/task.utils'

const Tasks = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user } = useSelector((state) => state.user)
  const { projects, projectsMap } = useSelector((state) => state.projects)
  const { tasks } = useSelector((state) => state.tasks)
  const { collapsed } = useSelector((state) => state.menu)

  const [viewMode, setViewMode] = useState(0)
  const [extendedTasks, setExtendedTasks] = useState({ data: [], links: [] })
  const [selectedProject, setSelectedProject] = useState(null)

  useEffect(() => {
    const fetchTasks = async () => {
      const { res, err } = await tasksApi.fetch()
      if (res) {
        dispatch(setTasks(res.tasks))
        setExtendedTasks([...res.tasks.map((task) => extendTask(task))])
      }
      if (err) toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')
    }

    fetchTasks()
  }, [])

  const updateTask = ({ taskId, updatedTask }) => {
    setTasks((prev) => ({
      ...prev,
      data: prev.data.map((task) => (task.id === taskId ? updatedTask : task)),
    }))
  }

  useEffect(() => {
    dispatch(setActive(menuIndices.tasks))
  }, [])

  return (
    <section id="tasks">
      <Menu />
      <section className={`content ${collapsed ? "expanded" : null}`} >
        <div className="heading">
          <h2 className="title h1">Tasks</h2>
          {
            user.projectRole === roles.productOwner && selectedProject !== null ? (
              <button className="cta pointer dark-btn paper-1" onClick={() => navigate('create', { state: { parentTaskId: null, projectId: selectedProject.value } })}>
                <IoMdAdd />
                <p>Create Task</p>
              </button>
            ) : null
          }
        </div>
        <p className="opacity-7">Tasks Count: {tasks.length}</p>
        <div className="task-options">
          <Select
            className="paper-1 select"
            isSearchable
            isClearable
            options={projects.map((project) => ({ value: project, label: projectsMap[project].title }))}
            name='project'
            placeholder="Select project"
            value={selectedProject}
            onChange={setSelectedProject}
          />
          <div className="view-options">
            <button
              className={`pointer paper-1 ${viewMode === 0 ? 'dark-btn' : ''}`}
              onClick={() => setViewMode(0)}
            >
              <LuGanttChartSquare />
              <p>Gantt Chart</p>
            </button>
            <button
              className={`pointer paper-1 ${viewMode === 1 ? 'dark-btn' : ''}`}
              onClick={() => setViewMode(1)}
            >
              <MdOutlineViewKanban />
              <p>Kanban Board</p>
            </button>
          </div>
        </div>
        <div className="task-container">
          {
            selectedProject
              ? viewMode === 0 ? <GanttChart tasks={extendedTasks} projectId={selectedProject.value} /> : <KanbanBoard tasks={extendedTasks} updateTask={updateTask} />
              : <p>Select a project to view tasks</p>
          }
        </div>
      </section>
    </section>
  )
}

export default Tasks