import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

import { defaultProfileImage } from '../../utils/profile.utils'
import { formatMessageTime } from '../../utils/message.utils'

const Message = ({ chat }) => {
  const { user } = useSelector((state) => state.user)
  const { membersMap } = useSelector((state) => state.organization)

  return (
    user.userId === chat.senderId ? (
      <div className='message by-user'>
        <div className="message-content">{chat.content}</div>
        <img className='profile-img' src={user.profilePageUrl || defaultProfileImage} alt="" />
        {/* <small className='opacity-5 time'>{formatMessageTime(chat.timestamp)}</small> */}
      </div>
    ) : (
      <div className='message'>
        <img className='profile-img' src={membersMap[chat.senderId].profilePageUrl || defaultProfileImage} alt="" />
        <div className="message-content">{chat.content}</div>
        {/* <small className='opacity-5 time'>{formatMessageTime(chat.timestamp)}</small> */}
      </div>
    )
  )
}

export default Message