import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { setActive } from '../redux/features/menuSlice'

const NotFoundPage = ({ previousActive }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleGoBack = () => {          
    if (window.history.length > 1) {
      dispatch(setActive(previousActive ?? 0))
      navigate(-1)
    } else {
      dispatch(setActive(0))
      navigate('/dashboard')
    }
  }

  const handleGoHome = () => {
    dispatch(setActive(0))
    navigate('/dashboard')
  }

  return (
    <div id="not-found">
      <h1>404 - Page Not Found</h1>
      <p>Oops! The page you are looking for doesn't exist.</p>
      <div className="cta">
        <div className="cta-btn pointer" onClick={handleGoBack}>Go Back</div>
        <div className="cta-btn pointer" onClick={handleGoHome}>Go Home</div>
      </div>
    </div>
  )
}

export default NotFoundPage
