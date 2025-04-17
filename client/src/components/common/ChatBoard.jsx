import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

import Message from './Message'

import { useSocket } from '../../contexts/SocketContext'

const ChatBoard = ({ id }) => {
  const scrollRef = useRef(null)

  const { chats } = useSelector((state) => state.chats)

  const { sendMessageInChat } = useSocket()

  const [message, setMessage] = useState('')

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleAddMessage()
    }
  }

  const handleAddMessage = async () => {
    if (message && message.trim() !== '') {
      sendMessageInChat({ id, payload: { content: message.trim() } })
      setMessage('')
    }
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'auto' })
    }
  }, [chats[id]])

  return (
    <div className="chat-board paper">
      <div className="messages no-scrollbar">
        {
          chats[id].map((chat, index) => (<Message key={index} chat={chat} />))
        }
        <div ref={scrollRef} />
      </div>
      <div className="input-field">
        <textarea
          className='paper-1 no-scrollbar'
          rows={1}
          type='text'
          name='message'
          placeholder='Message'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
        />
      </div>
    </div>
  )
}

export default ChatBoard