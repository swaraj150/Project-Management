import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'

import userApi from '../../api/modules/user.api'

import AuthOptions from './AuthOptions'

import { setUser } from '../../redux/features/userSlice'

import { preventDefaultBehaviour } from '../../utils/event.utils'

const SigninForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [hidePassword, setHidePassword] = useState(true)
  const [rememberMe, setRememberMe] = useState(false)

  const signinForm = useFormik({
    initialValues: {
      usernameOrEmail: '',
      password: ''
    },
    validationSchema: Yup.object({
      usernameOrEmail: Yup.string()
        .test(
          'usernameOrEmail',
          'Must be a valid email or a username (username should be at least 8 and atmost 20 characters long and contain only letters, numbers and underscores)', function (value) {
            const usernameRegex = /^[A-Za-z0-9_]{8,20}$/;
            return usernameRegex.test(value) || Yup.string().email().isValidSync(value);
          }
        )
        .required('Username or Email is required'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .max(20, 'Password must be at most 20 characters')
        .matches(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[~!@#$%&*?])[A-Za-z\d~!@#$%&*?]+$/,
          'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (~, !, @, #, $, %, &, *, ?)'
        )
        .required('Password is required')
    }),
    onSubmit: async ({ usernameOrEmail, password}) => {
      if (rememberMe) {
        localStorage.setItem('rememberMe', true)
        localStorage.setItem('username', usernameOrEmail)
      } else {
        localStorage.removeItem('rememberMe')
        localStorage.removeItem('username')
      }

      const { res, err } = await userApi.signin({ username: usernameOrEmail, password})

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
    }
  })

  useEffect(() => {
    if (localStorage.getItem('rememberMe') != null) setRememberMe(true)
    const savedUsername = localStorage.getItem('username')
    if (savedUsername) signinForm.setFieldValue('usernameOrEmail', savedUsername)
  }, [])

  
  useEffect(() => {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const code = urlParams.get('code')

    const githubLogin = async () => {
      const { res, err } = await userApi.githubSignin({ code })

      if (res) {
        dispatch(setUser(res))
        toast.success('Login successful. Welcome back!')
        navigate('/')
      }

      if (err) toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')
    }
    
    if (code != null) {
      githubLogin().then(() => {
        window.history.replaceState({}, document.title, window.location.pathname)
      })
    }
  }, [])

  return (
    <section className='auth-form'>
      <div className='auth-card paper'>
        <h1>Sign In</h1>
        <p className='prompt opacity-5'>Enter email and password to log in to you account.</p>
        <form onSubmit={signinForm.handleSubmit}>
          <div className="input-field">
            <input
              className='paper'
              type='text'
              name='usernameOrEmail'
              required
              placeholder='Email address or username'
              value={signinForm.values.usernameOrEmail}
              onChange={signinForm.handleChange}
              onBlur={signinForm.handleBlur}
            />
            <p className="helper-text opacity-5">
              {signinForm.touched.usernameOrEmail && signinForm.errors.usernameOrEmail ? signinForm.errors.usernameOrEmail : ''}
            </p>
          </div>
          <div className="input-field">
            <div className='password-field'>
              <input
                className='paper'
                type={hidePassword ? 'password' : 'text'}
                name='password'
                required
                placeholder='Password'
                value={signinForm.values.password}
                onChange={signinForm.handleChange}
                onBlur={signinForm.handleBlur}
                onPaste={preventDefaultBehaviour}
                onCopy={preventDefaultBehaviour}
              />
              {
                hidePassword
                  ? <FaEye className='pointer' onClick={() => setHidePassword(false)} />
                  : <FaEyeSlash className='pointer' onClick={() => setHidePassword(true)} />
              }
            </div>
            <p className="helper-text opacity-5">
              {signinForm.touched.password && signinForm.errors.password ? signinForm.errors.password : ''}
            </p>
          </div>
          <div className='form-utilities'>
            <div className={rememberMe ? 'remember-me-option active' : 'remember-me-option'}>
              <div className='switch paper-1 pointer' onClick={() => setRememberMe((prev) => !prev)}>
                <div className='switch-thumb'></div>
              </div>
              <p className='opacity-5 pointer' onClick={() => setRememberMe((prev) => !prev)}>Remember me</p>
            </div>
            <a href='/forgot-password'>Forgot password?</a>
          </div>
          <button
            className='paper pointer'
            type='submit'
            disabled={signinForm.isSubmitting || !signinForm.isValid}
          >
            Sign In
          </button>
        </form>
        <AuthOptions />
        <p>Want to create an account? <a href='/sign-up'>Sign Up</a></p>
      </div>
    </section>
  )
}

export default SigninForm