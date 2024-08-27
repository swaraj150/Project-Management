import { useState } from 'react'
import { useFormik } from 'formik'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import * as Yup from 'yup'

import GoogleLogo from '../../assets/google-logo.png'
import GithubLogo from '../../assets/github-logo.png'

const SigninForm = () => {
  const [rememberMe, setRememberMe] = useState(false)
  const [hidePassword, setHidePassword] = useState(true)

  const signinForm = useFormik({
    initialValues: {
      usernameOrEmail: '',
      password: ''
    },
    validationSchema: Yup.object({
      usernameOrEmail: Yup.string()
        .test(
          'usernameOrEmail', 
          'Must be a valid email or a username (username should be at least 8 characters long and contain only letters and numbers)', function (value) {
            const usernameRegex = /^[a-zA-Z0-9]{8,}$/;
            return usernameRegex.test(value) || Yup.string().email().isValidSync(value);
          }
        )
        .required('Username or Email is required'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/,
          'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (@, $, !, %, *, ?, &, #)'
        )
        .required('Password is required')
    }),
    onSubmit: async (values) => {
      console.log(values)
    }
  })

  const handleEnter = (e) => {
    if (e.key === 'Enter') signinForm.handleSubmit()
  }

  return (
    <section className='signin-form'>
      <div className='signin-card paper'>
        <h1>Sign In</h1>
        <p className='prompt opacity-5' >Enter email and password to log in to you account.</p>
        <form onSubmit={signinForm.handleSubmit} onKeyDown={(e) => handleEnter(e)}>
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
              />
              {
                hidePassword
                  ? <FontAwesomeIcon className='pointer' icon={faEye} onClick={() => setHidePassword(false)} />
                  : <FontAwesomeIcon className='pointer' icon={faEyeSlash} onClick={() => setHidePassword(true)} />
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
            type='submit'
            name='signin'
            className='paper pointer'
          >
            Sign In
          </button>
        </form>
        <div className='signin-option'>
          <div className='divider-text'>
            <hr />
            <span className='opacity-5'>Or sign in with</span>
            <hr />
          </div>
          <div className='options'>
            <div className='option paper pointer'>
              <img src={GoogleLogo} alt='' />
              <p>Sign in with google</p>
            </div>
            <div className='option paper pointer'>
              <img src={GithubLogo} alt='' />
              <p>Sign in with github</p>
            </div>
          </div>
        </div>
        <p>Want to create an account? <a href='/sign-up'>Sign Up</a></p>
      </div>
    </section>
  )
}

export default SigninForm