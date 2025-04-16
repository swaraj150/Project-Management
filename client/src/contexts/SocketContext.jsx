import { createContext, useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Client } from '@stomp/stompjs'

const SOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL

const SocketContext = createContext(null)

export const SocketProvider = ({ children }) => {
  const { user } = useSelector((state) => state.user)

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
        console.log(id, message)
      })
    }
  }

  const subscribeToTaskUpdates = ({ taskId }) => {
    if (stompClient?.connected) {
      return stompClient.subscribe(`/topic/task.update.${taskId}`, (task) => {
        console.log(task)
      })
    }
  }

  const sendMessageInChat = ({ id, payload }) => {
    console.log(id, payload, stompClient?.connected)
    if (stompClient?.connected) {
      stompClient.publish({ destination: `/app/chat.${id}`, headers: {}, body: JSON.stringify(payload) })
    }
  }

  return (
    <SocketContext.Provider
      value={{
        subscribeToChat,
        subscribeToTaskUpdates,
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