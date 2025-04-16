import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useGoogleLogin } from '@react-oauth/google'

import userApi from '../../api/modules/user.api'

import GoogleLogo from '../../assets/google-logo.png'
import GithubLogo from '../../assets/github-logo.png'

import { setUser } from '../../redux/features/userSlice'

const AuthOptions = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (oauthRes) => {
      const accessToken = oauthRes.access_token
      const { res, err } = await userApi.googleSignin({ accessToken })

      if (res) {
        if (res.token) localStorage.setItem('token', res.token)
        dispatch(setUser(res))
        toast.success('Login successful. Welcome back!')
        navigate('/dashboard')
      }

      if (err) {
        localStorage.removeItem('token')
        toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')
      }
    },
    onError: (error) => toast.error(typeof error === 'string' ? error : 'Google login failed!')
  })

  return (
    <div className='auth-options'>
      <div className='divider-text'>
        <hr />
        <span className='opacity-5'>Or continue with</span>
        <hr />
      </div>
      <div className='options'>
        <div className='option paper pointer' onClick={handleGoogleLogin}>
          <img src={GoogleLogo} alt='' />
          <p>Continue with Google</p>
        </div>
      </div>
    </div>
  )
}

export default AuthOptions