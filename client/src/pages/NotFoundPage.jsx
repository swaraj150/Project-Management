import React from 'react'
import { useNavigate } from 'react-router-dom'

const NotFoundPage = () => {
  const navigate = useNavigate()

  return (
    <div id="not-found">
      <h1>404 - Page Not Found</h1>
      <p>Oops! The page you are looking for doesn't exist.</p>
      <div className="cta">
        <div className="cta-btn ptr" onClick={() => navigate(-1)}>Go Back</div>
        <div className="cta-btn ptr" onClick={() => navigate('/')}>Go Home</div>
      </div>
    </div>
  )
}

export default NotFoundPage
