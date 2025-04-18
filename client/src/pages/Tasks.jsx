import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Select from 'react-select'
import { IoMdAdd } from 'react-icons/io'
import { LuGanttChartSquare } from 'react-icons/lu'
import { MdOutlineViewKanban } from 'react-icons/md'

import Menu from '../components/common/Menu'
import GanttChart from '../components/common/GanttChart'
import KanbanBoard from '../components/common/KanbanBoard'

import { useSelection } from '../contexts/SelectionContext'

import { setActive } from '../redux/features/menuSlice'

import { menuIndices } from '../utils/menu.utils'
import { roles } from '../utils/organization.utils'

const Tasks = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user } = useSelector((state) => state.user)
  const { projects, projectsMap } = useSelector((state) => state.projects)
  const { collapsed } = useSelector((state) => state.menu)

  const { selectedProject, setSelectedProject, setParentTaskId, taskViewMode, setTaskViewMode } = useSelection()

  const handleCreateTask = ({ parentTaskId }) => {
    setParentTaskId(parentTaskId)
    navigate('create')
  }

  useEffect(() => {
    dispatch(setActive(menuIndices.tasks))
  }, [])

  useEffect(() => {
    if (user.projectRole !== roles.productOwner && projects.length === 1) {
      setSelectedProject(projectsMap[projects[0]])
    }
  }, [user, projects])

  return (
    <section id="tasks">
      <Menu />
      <section className={`content ${collapsed ? "expanded" : null}`} >
        <div className="heading">
          <h2 className="title h1">Tasks</h2>
          <div className="task-options">
            {
              user.projectRole === roles.productOwner && (
                <Select
                  className="paper-1 select"
                  isSearchable
                  isClearable
                  options={projects.map((project) => ({ value: project, label: projectsMap[project].title }))}
                  name='project'
                  placeholder="Select project"
                  value={selectedProject ? { value: selectedProject.id, label: selectedProject.title } : null}
                  onChange={(option) => setSelectedProject(option ? projectsMap[option.value] : null)}
                />
              )
            }
            <div className="view-options">
              <button
                className={`pointer paper-1 ${taskViewMode === 0 ? 'dark-btn' : ''}`}
                onClick={() => setTaskViewMode(0)}
              >
                <LuGanttChartSquare />
                <p>Gantt Chart</p>
              </button>
              <button
                className={`pointer paper-1 ${taskViewMode === 1 ? 'dark-btn' : ''}`}
                onClick={() => setTaskViewMode(1)}
              >
                <MdOutlineViewKanban />
                <p>Kanban Board</p>
              </button>
            </div>
            {
            [roles.productOwner, roles.projectManager].includes(user.projectRole) && selectedProject !== null ? (
              <button className="cta pointer dark-btn paper-1" onClick={() => handleCreateTask({ parentTaskId: null })}>
                <IoMdAdd />
                <p>Create Task</p>
              </button>
            ) : null
          }
          </div>
        </div>
        {selectedProject && (<p className="opacity-7">Tasks Count: {selectedProject.tasks.data.length}</p>)}
        <div className="task-container">
          {
            selectedProject
              ? taskViewMode === 0 ? <GanttChart /> : <KanbanBoard />
              : user.projectRole !== roles.productOwner
                ? <p>You are currently not part of any project</p>
                : <p>Select a project to view tasks</p>
          }
        </div>
      </section>
    </section>
  )
}

export default Tasks