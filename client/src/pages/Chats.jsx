import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Select from 'react-select'

import Menu from '../components/common/Menu'
import ChatBoard from '../components/common/ChatBoard'

import { useSocket } from '../contexts/SocketContext'
import { useProject } from '../contexts/ProjectContext'

import { setActive } from '../redux/features/menuSlice'

import { menuIndices } from '../utils/menu.utils'
import { roles } from '../utils/organization.utils'

const Chats = () => {
  const dispatch = useDispatch()

  const { collapsed } = useSelector((state) => state.menu)
  const { user } = useSelector((state) => state.user)
  const { organization } = useSelector((state) => state.organization)
  const { tasks, tasksMap } = useSelector((state) => state.tasks)
  const { projects, projectsMap } = useSelector((state) => state.projects)
  const { organizationChats, projectChats, taskChats } = useSelector((state) => state.chats)

  const { sendMessageInChat } = useSocket()
  const { selectedProject, selectedTask, setSelectedProject, setSelectedTask } = useProject()

  const [chatOption, setChatOption] = useState(0)

  useEffect(() => {
    dispatch(setActive(menuIndices.chats))
  }, [])

  useEffect(() => {
    if (user.projectRole !== roles.productOwner && projects.length === 1) {
      setSelectedProject(projectsMap[projects[0]])
    }
  }, [user, projects])

  useEffect(() => {
    if (organization) sendMessageInChat({ id: organization.id, payload: { content: "hello" } })
  }, [organization])

  const getChatBoard = () => {
    switch (chatOption) {
      case 0:
        return <ChatBoard chats={organizationChats} />
      case 1:
        return selectedProject ? <ChatBoard chats={projectChats[selectedProject.id]} /> : null
      case 2:
        return selectedTask ? <ChatBoard chats={taskChats[selectedTask.id]} /> : null
    }
  }

  return (
    <section id="chats">
      <Menu />
      <section className={`content ${collapsed ? "expanded" : null}`} >
        <div className="chat-context">
          {(chatOption === 1 && user.projectRole === roles.productOwner || chatOption === 2) && (
            <Select
              className="paper-1 select"
              isSearchable
              isClearable
              options={chatOption === 1
                ? projects.map((projectId) => ({ value: projectId, label: projectsMap[projectId].title }))
                : tasks.map((taskId) => ({ value: taskId, label: tasksMap[taskId].title }))
              }
              name={chatOption === 1 ? 'project' : 'task'}
              placeholder={`Select ${chatOption === 1 ? 'project' : 'task'}`}
              value={chatOption === 1
                ? (selectedProject ? { value: selectedProject.id, label: projectsMap[selectedProject.id].title } : null)
                : (selectedTask ? { value: selectedTask.id, label: tasksMap[selectedTask.id].title } : null)
              }
              onChange={(option) => {
                chatOption === 1
                  ? setSelectedProject(projectsMap[option.value])
                  : setSelectedTask(tasksMap[option.value])
              }}
            />
          )}
          <div className="chat-options">
            <button
              className={`pointer paper-1 ${chatOption === 0 ? 'dark-btn' : null}`}
              onClick={() => setChatOption(0)}
            >
              Organization
            </button>
            <button
              className={`pointer paper-1 ${chatOption === 1 ? 'dark-btn' : null}`}
              onClick={() => setChatOption(1)}
            >
              Project
            </button>
            {user.projectRole !== roles.productOwner && (
              <button
                className={`pointer paper-1 ${chatOption === 2 ? 'dark-btn' : null}`}
                onClick={() => setChatOption(2)}
              >
                Task
              </button>
            )}
          </div>
        </div>
        {getChatBoard()}
      </section>
    </section>
  )
}

export default Chats