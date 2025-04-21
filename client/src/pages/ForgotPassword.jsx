import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'

import userApi from '../api/modules/user.api'

import Welcome from '../components/common/Welcome'
import AuthOptions from '../components/common/AuthOptions'

const ForgotPassword = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [hidePassword, setHidePassword] = useState(true)

  const forgotPasswordForm = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .test(
          'email',
          'Must be a valid email', function (value) {
            return Yup.string().email().isValidSync(value);
          }
        )
        .required('Username is required')
    }),
    onSubmit: async ({ email }) => {
      const { res, err } = await userApi.forgotPassword({ email })

      if (res) {
        toast.success('Password reset email has been sent successfully!')
        navigate('/sign-in')
      }
      if (err) toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')
    }
  })

  return (
    <section className='auth-container'>
      <Welcome />
      <section className='auth-form'>
        <div className='auth-card paper'>
          <h1>Forgot Password</h1>
          <p className='prompt opacity-5'>Enter email to get reset password email</p>
          <form onSubmit={forgotPasswordForm.handleSubmit}>
            <div className="input-field">
              <input
                className='paper'
                type='text'
                name='email'
                required
                placeholder='Email address'
                value={forgotPasswordForm.values.email}
                onChange={forgotPasswordForm.handleChange}
                onBlur={forgotPasswordForm.handleBlur}
              />
              <p className="helper-text opacity-5">
                {forgotPasswordForm.touched.email && forgotPasswordForm.errors.email ? forgotPasswordForm.errors.email : ''}
              </p>
            </div>
            <button
              className='paper pointer'
              type='submit'
              disabled={forgotPasswordForm.isSubmitting || !forgotPasswordForm.isValid}
            >
              Submit
            </button>
          </form>
          <AuthOptions />
          <p>Go back to sign in page? <a href='/sign-in'>Sign In</a></p>
        </div>
      </section>
    </section>
  )
}

export default ForgotPassword