import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { useGoogleLogin } from '@react-oauth/google'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'

import userApi from '../../api/modules/user.api'

import AuthOptions from './AuthOptions'

import { setUser } from '../../redux/features/userSlice'

import { preventDefaultBehaviour } from '../../utils/event.utils'

const SignupForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [hidePassword, setHidePassword] = useState(true)
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true)

  const signupForm = useFormik({
    initialValues: {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationSchema: Yup.object({
      firstname: Yup.string()
        .matches(/^[a-zA-Z''-'\s]{1,20}$/, 'First name can only contain letters, spaces, hyphens, and apostrophes (max 20 characters)')
        .required('Firstname is required'),
      lastname: Yup.string()
        .matches(/^[a-zA-Z''-'\s]{1,20}$/, 'Last name can only contain letters, spaces, hyphens, and apostrophes (max 20 characters)')
        .required('Lastname is required'),
      email: Yup.string()
        .email('Enter a valid email address')
        .required('Email is required'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .max(20, 'Password must be at most 20 characters')
        .matches(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[~!@#$%&*?])[A-Za-z\d~!@#$%&*?]+$/,
          'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (~, !, @, #, $, %, &, *, ?)'
        )
        .required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password is required')
    }),
    onSubmit: async ({ firstname, lastname, email, password }) => {
      const { res, err } = await userApi.signup({ firstname, lastname, email, password })
      if (res) {
        if (res.token) localStorage.setItem('token', res.token)
        dispatch(setUser(res))
        toast.success('Registration successful! Welcome aboard.')
        navigate('/dashboard')
      }
      if (err) {
        localStorage.removeItem('token')
        toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')
      }
    }
  })

  return (
    <section className='auth-form'>
      <div className='auth-card paper'>
        <h1>Sign Up</h1>
        <p className='prompt opacity-5' >Enter following details to create an account.</p>
        <form onSubmit={signupForm.handleSubmit}>
          <div className="name">
            <div className="input-field">
              <input
                className='paper'
                type='text'
                name='firstname'
                required
                placeholder='First name'
                value={signupForm.values.firstname}
                onChange={signupForm.handleChange}
                onBlur={signupForm.handleBlur}
              />
              <p className="helper-text opacity-5">
                {signupForm.touched.firstname && signupForm.errors.firstname ? signupForm.errors.firstname : ''}
              </p>
            </div>
            <div className="input-field">
              <input
                className='paper'
                type='text'
                name='lastname'
                required
                placeholder='Last name'
                value={signupForm.values.lastname}
                onChange={signupForm.handleChange}
                onBlur={signupForm.handleBlur}
              />
              <p className="helper-text opacity-5">
                {signupForm.touched.lastname && signupForm.errors.lastname ? signupForm.errors.lastname : ''}
              </p>
            </div>
          </div>
          <div className="input-field">
            <input
              className='paper'
              type='text'
              name='email'
              required
              placeholder='Email'
              value={signupForm.values.email}
              onChange={signupForm.handleChange}
              onBlur={signupForm.handleBlur}
            />
            <p className="helper-text opacity-5">
              {signupForm.touched.email && signupForm.errors.email ? signupForm.errors.email : ''}
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
                value={signupForm.values.password}
                onChange={signupForm.handleChange}
                onBlur={signupForm.handleBlur}
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
              {signupForm.touched.password && signupForm.errors.password ? signupForm.errors.password : ''}
            </p>
          </div>
          <div className="input-field">
            <div className='password-field'>
              <input
                className='paper'
                type={hideConfirmPassword ? 'password' : 'text'}
                name='confirmPassword'
                required
                placeholder='Confirm password'
                value={signupForm.values.confirmPassword}
                onChange={signupForm.handleChange}
                onBlur={signupForm.handleBlur}
                onPaste={preventDefaultBehaviour}
                onCopy={preventDefaultBehaviour}
              />
              {
                hideConfirmPassword
                  ? <FaEye className='pointer' onClick={() => setHideConfirmPassword(false)} />
                  : <FaEyeSlash className='pointer' onClick={() => setHideConfirmPassword(true)} />
              }
            </div>
            <p className="helper-text opacity-5">
              {signupForm.touched.confirmPassword && signupForm.errors.confirmPassword ? signupForm.errors.confirmPassword : ''}
            </p>
          </div>
          <button
            type='submit'
            name='signup'
            className='paper pointer'
          >
            Sign Up
          </button>
        </form>
        <AuthOptions />
        <p>Already have an account? <a href='/sign-in'>Sign In</a></p>
      </div>
    </section>
  )
}

export default SignupForm