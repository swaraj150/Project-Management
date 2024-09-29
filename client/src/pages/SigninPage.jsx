import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import Welcome from '../components/common/Welcome'
import SigninForm from '../components/common/SigninForm'

const SigninPage = () => {
  const navigate = useNavigate()

  const { user } = useSelector((state) => state.user)

  useEffect(() => {
    if (user) navigate('/')
    
    const token = localStorage.getItem('token')

    if (token !== null) navigate('/')
  }, [])

  return (
    <section className='signin'>
      <Welcome />
      <SigninForm />
    </section>
  )
}

export default SigninPage