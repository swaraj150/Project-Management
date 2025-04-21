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
        <div className="message-content">
          {chat.fileName && (
            <div className="chip">
              <p title={file.fileName}>{file.fileName}</p>
            </div>
          )}
          <p>{chat.content}</p>
        </div>
        <img className='profile-img' src={user.profilePageUrl || defaultProfileImage} alt="" />
        {/* <small className='opacity-5 time'>{formatMessageTime(chat.timestamp)}</small> */}
      </div>
    ) : (
      <div className='message'>
        <img className='profile-img' src={membersMap[chat.senderId].profilePageUrl || defaultProfileImage} alt="" />
        <div className="message-content">
          <p>{chat.content}</p>
        </div>
        {/* <small className='opacity-5 time'>{formatMessageTime(chat.timestamp)}</small> */}
      </div>
    )
  )
}

export default Message