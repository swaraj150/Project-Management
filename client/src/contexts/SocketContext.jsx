import { createContext, useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Client } from '@stomp/stompjs'

import { addMember } from '../redux/features/organizationSlice'
import { addTeam } from '../redux/features/teamsSlice'
import { addLinkToProject, addProject, addTaskToProject, deleteLinkFromProject, deleteTaskFromProject } from '../redux/features/projectsSlice'
import { addLink, addTask, deleteLink, deleteTask, updateTask } from '../redux/features/tasksSlice'
import { addChat } from '../redux/features/chatsSlice'

const dataTypes = {
  chat: 'CHAT',
  task: 'TASK',
  link: 'LINK',
  team: 'TEAM',
  user: 'USER',
  project: 'PROJECT',
  id: 'ID'
}

const methods = {
  create: 'CREATE',
  update: 'UPDATE',
  delete: 'DELETE'
}

const SOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL

const SocketContext = createContext(null)

export const SocketProvider = ({ children }) => {
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.user)
  const { tasks } = useSelector((state) => state.tasks)

  const [stompClient, setStompClient] = useState(null)

  useEffect(() => {
    if (user) {
      const client = new Client({
        brokerURL: SOCKET_URL,
        connectHeaders: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        onConnect: (frame) => {
          console.log('websocket connected', frame)
        },
        onDisconnect: () => {
          console.log('websocket disconnected')
        },
        onStompError: (error) => {
          console.log('websocket error', error)
        }
      })

      client.activate()
      setStompClient(client)

      return () => {
        client.deactivate()
      }
    }
  }, [user])

  const subscribeToChat = ({ id }) => {
    if (stompClient?.connected) {
      return stompClient.subscribe(`/topic/chat.${id}`, (message) => {
        const { dataType, notification, data, method } = JSON.parse(message.body)
        switch (dataType) {
          case dataTypes.chat:
            dispatch(addChat({ id, chat: data }))
            break
        }
      })
    }
  }

  const subscribeToOrganization = ({ organizationId }) => {
    if (stompClient?.connected) {
      return stompClient.subscribe(`/topic/organization.${organizationId}`, (message) => {
        const { dataType, notification, data, method } = JSON.parse(message.body)
        switch (dataType) {
          case dataTypes.user:
            dispatch(addMember(data))
            break
        }
      })
    }
  }

  const subscribeToProject = ({ projectId }) => {
    if (stompClient?.connected) {
      return stompClient.subscribe(`/topic/project.${projectId}`, (message) => {
        const { dataType, notification, data, method } = JSON.parse(message.body)
        switch (dataType) {
          case dataTypes.task:
            switch (method) {
              case methods.create:
                dispatch(addTask(data))
                dispatch(addTaskToProject({ projectId, taskId: data.id }))
                break
              case methods.update:
                dispatch(updateTask(data))
                break;
              case methods.delete:
                dispatch(deleteTask({ id: data }))
                dispatch(deleteTaskFromProject({ projectId, taskId: data }))
                break
            }
            break
          case dataTypes.link:
            switch (method) {
              case methods.create:
                dispatch(addLink(data))
                dispatch(addLinkToProject({ projectId, taskId: data.id }))
                break
              case methods.delete:
                dispatch(deleteLink({ id: data }))
                dispatch(deleteLinkFromProject({ projectId, taskId: data }))
                break
            }
            break
        }
      })
    }
  }

  const subscribeToTeam = ({ teamId }) => {
    if (stompClient?.connected) {
      return stompClient.subscribe(`/topic/team.${teamId}`, (message) => {
        const { dataType, notification, data, method } = JSON.parse(message.body)
        switch (dataType) {
          case dataTypes.project:
            dispatch(addProject(data))
            break
        }
      })
    }
  }

  const subscribeToUser = ({ userId }) => {
    if (stompClient?.connected) {
      return stompClient.subscribe(`/topic/user.${userId}`, (message) => {
        const { dataType, notification, data, method } = JSON.parse(message.body)
        switch (dataType) {
          case dataTypes.team:
            dispatch(addTeam(data))
            break
        }
      })
    }
  }

  const sendMessageInChat = ({ id, payload }) => {
    if (stompClient?.connected) {
      stompClient.publish({ destination: `/app/chat.${id}`, headers: {}, body: JSON.stringify(payload) })
    }
  }

  return (
    <SocketContext.Provider
      value={{
        subscribeToChat,
        subscribeToOrganization,
        subscribeToProject,
        subscribeToTeam,
        subscribeToUser,
        sendMessageInChat
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => {
  return useContext(SocketContext)
}