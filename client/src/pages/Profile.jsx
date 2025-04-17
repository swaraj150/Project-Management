import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { MdEdit, MdCancel } from 'react-icons/md'
import { FaSave } from 'react-icons/fa'

import userApi from '../api/modules/user.api'

import Menu from '../components/common/Menu'
import ProfileDetails from '../components/common/ProfileDetails'
import ProfileForm from '../components/common/ProfileForm'

import { useSelection } from '../contexts/SelectionContext'

import { setActive } from '../redux/features/menuSlice'
import { setUser } from '../redux/features/userSlice'

import { menuIndices } from '../utils/menu.utils'

const Profile = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { profileName } = useParams()

  const { collapsed } = useSelector((state) => state.menu)
  const { user } = useSelector((state) => state.user)

  const { selectedUser, setSelectedUser } = useSelection()

  const [isEditing, setIsEditing] = useState(false)

  const profileForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstname: '',
      lastname: '',
      gender: '',
      dob: '',
      phoneNumber: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      code: '',
      state: '',
      country: '',
      skills: []
    },
    validationSchema: Yup.object({
      firstname: Yup.string()
        .matches(/^[a-zA-Z''-'\s]{1,20}$/, 'First name can only contain letters, spaces, hyphens, and apostrophes (max 20 characters)')
        .required('Firstname is required'),
      lastname: Yup.string()
        .matches(/^[a-zA-Z''-'\s]{1,20}$/, 'Last name can only contain letters, spaces, hyphens, and apostrophes (max 20 characters)')
        .required('Lastname is required'),
      gender: Yup.string()
        .required('Gender is required'),
      dob: Yup.string()
        .required('Date of birth is required')
        .test('is-valid-date', 'Date of birth cannot be in the future', function (value) {
          if (!value) return false;
          const today = new Date();
          const inputDate = new Date(value);
          return inputDate <= today;
        }),
      phoneNumber: Yup.string()
        .matches(/^\+?\d{10,15}$/, 'Enter a valid phone number (10-15 digits)')
        .required('Phone number is required'),
      addressLine1: Yup.string()
        .max(100, 'Address Line 1 should be under 100 characters')
        .required('Address Line 1 is required'),
      addressLine2: Yup.string()
        .max(100, 'Address Line 2 should be under 100 characters')
        .nullable(),
      city: Yup.string()
        .max(50, 'City name should be under 50 characters')
        .required('City is required'),
      code: Yup.string()
        .matches(/^\d{4,10}$/, 'Enter a valid postal/ZIP code')
        .required('Postal/ZIP code is required'),
      state: Yup.string()
        .max(50)
        .required('State is required'),
      country: Yup.string()
        .max(50)
        .required('Country is required'),
      skills: Yup.array()
        .of(
          Yup.object({
            name: Yup.string().required('Skill name is required'),
            proficiency: Yup.string().required('Proficiency is required')
          })
        )
    }),
    onSubmit: async ({ firstname, lastname, gender, dob, phoneNumber, addressLine1, addressLine2, city, code, state, country, skills }) => {
      console.log('hello')
      const { res, err } = await userApi.updateProfile({
        ...user,
        firstname,
        lastname,
        gender,
        dob,
        phoneNumber,
        addressLine1,
        addressLine2,
        city,
        code,
        state,
        country,
        skills: skills.map((skill) => skill.value)
      })
      if (res.user) {
        dispatch(setUser(res.user))
        toast.success('Profile updated successfully!')
        setIsEditing(false)
      }
      if (err) toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')
    }
  })

  useEffect(() => {
    if (selectedUser?.userId === user.userId) dispatch(setActive(menuIndices.profile))
  }, [selectedUser])

  useEffect(() => {
    if (!selectedUser) {
      if (profileName === 'me') setSelectedUser(user)
      else navigate(-1)
    }
  }, [])

  return (
    <section id='profile'>
      <Menu />
      {selectedUser && (
        <section className={`content ${collapsed ? 'expanded' : null}`} >
          {selectedUser.userId === user.userId && (
            <>
              <h1 className='profile-welcome'>Welcome, {selectedUser.name.split(' ')[0]}</h1>
              <p>{new Date().toLocaleDateString('en-GB', {
                weekday: 'short',
                day: '2-digit',
                month: 'long',
                year: 'numeric'
              })}</p>
            </>
          )}
          <div className='profile-info paper'>
            <div className='gradient'></div>
            <div className='hero-section'>
              <img className='profile-img' src='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png' alt='' />
              <div className="profile-heading">
                <p className='name' >{selectedUser.name}</p>
                <p className="opacity-5">{selectedUser.emails[0]}</p>
              </div>
              {selectedUser.userId === user.userId ? (
                isEditing ? (
                  <div className="cta">
                    <button
                      className='pointer paper-1'
                      onClick={() => setIsEditing(false)}
                    >
                      <MdCancel />
                      <p>Cancel</p>
                    </button>
                    <button
                      type='button'
                      className='pointer dark-btn paper-1'
                      onClick={profileForm.handleSubmit}
                    >
                      <FaSave />
                      <p>Save</p>
                    </button>
                  </div>
                ) : (
                  <div className="cta">
                    <button
                      className='pointer dark-btn paper-1'
                      onClick={() => setIsEditing(true)}
                    >
                      <MdEdit />
                      <p>Edit</p>
                    </button>
                  </div>
                )
              ) : null}
            </div>
            {isEditing ? <ProfileForm profileForm={profileForm} /> : <ProfileDetails />}
          </div>
        </section>
      )}
    </section>
  )
}

export default Profile