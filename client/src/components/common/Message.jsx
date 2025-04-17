import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

const Message = ({ chat }) => {
  const { user } = useSelector((state) => state.user)
  const { membersMap } = useSelector((state) => state.organization)

  useEffect(() => {
    if (membersMap) console.log(membersMap[chat.senderId].name, chat.content)
  }, [chat.senderId, membersMap])

  return (
    user.userId === chat.senderId ? (
      <div className='message by-user'>
        <div className="message-content">{chat.content}</div>
        <img className='profile-img' src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" alt="" />
      </div>
    ) : (
      <div className='message'>
        <img className='profile-img' src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" alt="" />
        <div className="message-content">{chat.content}</div>
      </div>
    )
  )
}

export default Message