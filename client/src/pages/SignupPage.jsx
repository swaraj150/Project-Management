import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import Welcome from '../components/common/Welcome'
import SignupForm from '../components/common/SignupForm'

const SignupPage = () => {
  const navigate = useNavigate()

  const { user } = useSelector((state) => state.user)

  useEffect(() => {
    if (user) navigate('/')
    
    const token = localStorage.getItem('projectMaestroToken')

    if (token !== null) navigate('/')
  }, [])

  return (
    <section className='auth-container'>
      <Welcome />
      <SignupForm />
    </section>
  )
}

export default SignupPage