import React from 'react'
import { useGoogleLogin } from '@react-oauth/google'

import userApi from '../../api/modules/user.api'

import GoogleLogo from '../../assets/google-logo.png'
import GithubLogo from '../../assets/github-logo.png'

import { setUser } from '../../redux/features/userSlice'

const AuthOptions = () => {
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (oauthRes) => {
      const accessToken = oauthRes.access_token

      const { res, err } = await userApi.googleSignin({ accessToken })

      if (res) {
        dispatch(setUser(res))
        toast.success('Login successful. Welcome back!')
        navigate('/')
      }

      if (err) toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')
    },
    onError: (error) => toast.error(typeof error === 'string' ? error : 'Google login failed!')
  })

  const handleGithubLogin = () => {
    window.location.assign(`https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_OAUTH2_GITHUB_CLIENT_ID}`)
  }

  return (
    <div className='signin-option'>
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
        <div className='option paper pointer' onClick={handleGithubLogin}>
          <img src={GithubLogo} alt='' />
          <p>Continue with Github</p>
        </div>
      </div>
    </div>
  )
}

export default AuthOptions