import { createContext, useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Client } from '@stomp/stompjs'

import { addTask, updateTask } from '../redux/features/tasksSlice'
import { addChat } from '../redux/features/chatsSlice'

const dataTypes = {
  chat: 'CHAT',
  task: 'TASK',
  link: 'LINK',
  team: 'TEAM'
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
        const { dataType, notification, data } = JSON.parse(message.body)
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
      return stompClient.subscribe(`/topic/organization.${organizationId}`, (task) => {
        console.log(task)
      })
    }
  }

  const subscribeToProject = ({ projectId }) => {
    if (stompClient?.connected) {
      return stompClient.subscribe(`/topic/project.${projectId}`, (message) => {
        // const { dataType, notification, data } = JSON.parse(message.body)
        // switch (dataType) {
        //   case dataTypes.team:
        //     break
        //   case dataTypes.task:
        //     if (tasks.includes(data.id)) dispatch(updateTask(data))
        //     else dispatch(addTask(data))
        //     break
        //   case dataTypes.link:
        //     break
        // }
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