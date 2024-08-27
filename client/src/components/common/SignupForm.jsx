import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useFormik } from 'formik'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import * as Yup from 'yup'
import { toast } from 'react-toastify'

import userApi from '../../api/modules/user.api'

import GoogleLogo from '../../assets/google-logo.png'
import GithubLogo from '../../assets/github-logo.png'

import { setUser } from '../../redux/features/userSlice'

const SignupForm = () => {
  const [hidePassword, setHidePassword] = useState(true)
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true)

  const signupForm = useFormik({
    initialValues: {
      firstname: '',
      lastname: '',
      username: '',
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
      username: Yup.string()
        .min(8, 'Username must be at least 8 characters')
        .matches(/^[a-zA-Z0-9]+$/, 'Username can contain only letters and numbers')
        .required('Username is required'),
      email: Yup.string()
        .email('Enter a valid email address')
        .required('Email is required'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/,
          'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (@, $, !, %, *, ?, &, #)'
        )
        .required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password is required')
    }),
    onSubmit: async (values) => {
      const { res, err } = await userApi.signup(values)

      if (res) {
        dispatch(setUser(res))
        toast.success('Registration successful! Welcome aboard.')
      }

      if (err) toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')
    }
  })

  return (
    <section className='signup-form'>
      <div className='signup-card paper'>
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
              <p className="helper-text">
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
              <p className="helper-text">
                {signupForm.touched.lastname && signupForm.errors.lastname ? signupForm.errors.lastname : ''}
              </p>
            </div>
          </div>
          <div className="input-field">
            <input
              className='paper'
              type='text'
              name='username'
              required
              placeholder='Username'
              value={signupForm.values.username}
              onChange={signupForm.handleChange}
              onBlur={signupForm.handleBlur}
            />
            <p className="helper-text">
              {signupForm.touched.username && signupForm.errors.username ? signupForm.errors.username : ''}
            </p>
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
            <p className="helper-text">
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
              />
              {
                hidePassword
                  ? <FontAwesomeIcon className='pointer' icon={faEye} onClick={() => setHidePassword(false)} />
                  : <FontAwesomeIcon className='pointer' icon={faEyeSlash} onClick={() => setHidePassword(true)} />
              }
            </div>
            <p className="helper-text">
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
              />
              {
                hideConfirmPassword
                  ? <FontAwesomeIcon className='pointer' icon={faEye} onClick={() => setHideConfirmPassword(false)} />
                  : <FontAwesomeIcon className='pointer' icon={faEyeSlash} onClick={() => setHideConfirmPassword(true)} />
              }
            </div>
            <p className="helper-text">
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
        <div className='signup-option'>
          <div className='divider-text'>
            <hr />
            <span className='opacity-5'>Or sign up with</span>
            <hr />
          </div>
          <div className='options'>
            <div className='option paper pointer'>
              <img src={GoogleLogo} alt='' />
              <p>Sign up with google</p>
            </div>
            <div className='option paper pointer'>
              <img src={GithubLogo} alt='' />
              <p>Sign up with github</p>
            </div>
          </div>
        </div>
        <p>Already have an account? <a href='/sign-in'>Sign In</a></p>
      </div>
    </section>
  )
}

export default SignupForm