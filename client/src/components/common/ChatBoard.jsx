import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { FaPaperclip } from 'react-icons/fa'
import { TiDelete } from 'react-icons/ti'

import filesApi from '../../api/modules/files.api'

import Message from './Message'

import { useSocket } from '../../contexts/SocketContext'

const ChatBoard = ({ id }) => {
  const scrollRef = useRef(null)

  const { chats } = useSelector((state) => state.chats)

  const { sendMessageInChat } = useSocket()

  const [message, setMessage] = useState('')
  const [file, setFile] = useState(null)

  const handleChoose = async (e) => {
    e.preventDefault()

    const { res, err } = await filesApi.upload({ file: e.target.files[0] })
    if (res?.url && res['file name']) {
      setFile({ url: res.url, name: res['file name'] })
      toast.success(`${res['file name']} uploaded successfully!`)
    }
    if (err) toast.error(typeof err === 'string' ? err : `Failed to upload ${file.name}`)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleAddMessage()
    }
  }

  const handleAddMessage = async () => {
    if (message && message.trim() !== '') {
      if (file) sendMessageInChat({ id, payload: { content: message.trim(), fileName: file.name, fileUrl: file.url } })
      else sendMessageInChat({ id, payload: { content: message.trim() } })
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
      <div className="message-toolbar">
        <div className="choose-file">
          <label className='pointer' htmlFor="upload">
            <FaPaperclip />
          </label>
          <input
            id='upload'
            name='upload'
            hidden
            type="file"
            onChange={handleChoose}
            disabled={file !== null}
          />
        </div>
        {file && (
          <div className="chip">
            <TiDelete className='pointer' onClick={() => setFile(null)} />
            <p title={file.name}>{file.name}</p>
          </div>
        )}
        <textarea
          className={`paper-1 no-scrollbar ${file ? 'file-selected' : null}`}
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