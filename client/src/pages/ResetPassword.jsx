import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

import userApi from '../api/modules/user.api'

import Menu from '../components/common/Menu'

import { useSelection } from '../contexts/SelectionContext'

import { setActive } from '../redux/features/menuSlice'

import { menuIndices } from '../utils/menu.utils'
import { preventDefaultBehaviour } from '../utils/event.utils'

const ResetPassword = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const { collapsed } = useSelector((state) => state.menu)
  const { user } = useSelector((state) => state.user)

  const { selectedUser } = useSelection()

  const [hidePassword, setHidePassword] = useState(true)
  const [hideNewPassword, setHideNewPassword] = useState(true)
  const [hideConfirmNewPassword, setHideConfirmNewPassword] = useState(true)

  const code = searchParams.get('code')

  const passwordResetForm = useFormik({
    initialValues: {
      password: '',
      newPassword: '',
      confirmNewPassword: ''
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .required('Password is required'),
      newPassword: Yup.string()
        .min(8, 'New password must be at least 8 characters')
        .max(20, 'New password must be at most 20 characters')
        .matches(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[~!@#$%&*?])[A-Za-z\d~!@#$%&*?]+$/,
          'New password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (~, !, @, #, $, %, &, *, ?)'
        )
        .notOneOf([Yup.ref('password')], 'New password must be different from current password')
        .required('New password is required'),
      confirmNewPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
        .required('Confirm new password is required')
    }),
    onSubmit: async ({ password, newPassword }) => {
      if (user) {
        const { res, err } = await userApi.resetPassword({ password, newPassword, isAuthenticated: true })
        if (res) {
          toast.success('Password updated successfully!')
          navigate(-1)
        }
        if (err) toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')
      } else {
        const { res, err } = await userApi.resetPassword({ code, newPassword, isAuthenticated: false })
        if (res) {
          toast.success('Password updated successfully!')
          navigate('/sign-in')
        }
        if (err) toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')
      }
    }
  })

  useEffect(() => {
    if (selectedUser?.userId === user.userId) dispatch(setActive(menuIndices.profile))
  }, [selectedUser])

  return (
    user ? (
      <section id="reset-password">
        <Menu />
        <section className={`content ${collapsed ? 'expanded' : null}`} >
          <form onSubmit={passwordResetForm.handleSubmit}>
            <div className="input-field">
              <div className='password-field'>
                <input
                  className='paper'
                  type={hidePassword ? 'password' : 'text'}
                  name='password'
                  required
                  placeholder='Password'
                  value={passwordResetForm.values.password}
                  onChange={passwordResetForm.handleChange}
                  onBlur={passwordResetForm.handleBlur}
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
                {passwordResetForm.touched.password && passwordResetForm.errors.password ? passwordResetForm.errors.password : ''}
              </p>
            </div>
            <button
              className='paper pointer'
              type='submit'
              disabled={passwordResetForm.isSubmitting || !passwordResetForm.isValid}
            >
              Sign In
            </button>
          </form>
        </section>
      </section>
    ) : (
      null
    )
  )
}

export default ResetPassword