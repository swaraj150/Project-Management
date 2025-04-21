import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { MdEdit, MdCancel, MdImage, MdLockReset } from 'react-icons/md'
import { FaSave, FaUpload } from 'react-icons/fa'
import { TiDelete } from 'react-icons/ti'

import userApi from '../api/modules/user.api'
import filesApi from '../api/modules/files.api'

import Menu from '../components/common/Menu'
import ProfileDetails from '../components/common/ProfileDetails'
import ProfileForm from '../components/common/ProfileForm'

import { useSelection } from '../contexts/SelectionContext'

import { setActive } from '../redux/features/menuSlice'
import { setUser } from '../redux/features/userSlice'
import { updateMember } from '../redux/features/organizationSlice'

import { menuIndices } from '../utils/menu.utils'
import { technologyLabels } from '../utils/project.utils'
import { defaultProfileImage } from '../utils/profile.utils'

const Profile = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const initialFormValues = useRef(null)
  const { profileName } = useParams()

  const { collapsed } = useSelector((state) => state.menu)
  const { user } = useSelector((state) => state.user)

  const { selectedUser, setSelectedUser } = useSelection()

  const [isEditing, setIsEditing] = useState(false)
  const [dataInitialized, setDataInitialized] = useState(false)
  const [file, setFile] = useState(null)

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
      skills: [],
      profilePageUrl: ''
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
        .matches(
          /^\+?[0-9\s\-()]{10,20}$/,
          'Enter a valid phone number (10–20 characters, digits, spaces, dashes, or parentheses)'
        )
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
            label: Yup.string().required('Skill name is required'),
            value: Yup.string().required('Proficiency is required')
          })
        ),
      profilePageUrl: Yup.string()
    }),
    onSubmit: async ({ firstname, lastname, gender, dob, phoneNumber, addressLine1, addressLine2, city, code, state, country, skills, profilePageUrl }) => {
      const { res, err } = await userApi.updateProfile({
        ...user,
        firstname,
        lastname,
        gender,
        dob,
        phone: phoneNumber,
        addressLine1,
        addressLine2,
        city,
        code,
        state,
        country,
        skills: skills.map((skill) => skill.value),
        url: profilePageUrl
      })
      if (res?.user) {
        dispatch(setUser(res.user))
        dispatch(updateMember(res.user))
        setSelectedUser(res.user)
        toast.success('Profile updated successfully!')
        setIsEditing(false)
      }
      if (err) toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')
    }
  })

  const isFormUnchanged = () => {
    if (!initialFormValues.current) return true
    const curr = profileForm.values
    const init = initialFormValues.current
    return (
      curr.firstname === init.firstname &&
      curr.lastname === init.lastname &&
      curr.gender === init.gender &&
      curr.dob === init.dob &&
      curr.phoneNumber === init.phoneNumber &&
      curr.addressLine1 === init.addressLine1 &&
      curr.addressLine2 === init.addressLine2 &&
      curr.city === init.city &&
      curr.state === init.state &&
      curr.code === init.code &&
      curr.country === init.country &&
      JSON.stringify(curr.skills) === JSON.stringify(init.skills) &&
      curr.profilePageUrl === init.profilePageUrl
    )
  }

  const handleChoose = async (e) => {
    e.preventDefault()
    setFile(e.target.files[0])
  }

  const handleUpload = async () => {
    const { res, err } = await filesApi.upload({ file })
    if (res?.url) {
      profileForm.setFieldValue('profilePageUrl', import.meta.env.VITE_BACKEND_BASE_URL + res.url)
      toast.success('Profile image uploaded successfully!')
      setFile(null)
    }
    if (err) toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')
  }

  useEffect(() => {
    if (!selectedUser) {
      if (profileName === 'me') setSelectedUser(user)
      else navigate(-1)
    }
  }, [])

  useEffect(() => {
    if (selectedUser?.userId === user.userId) dispatch(setActive(menuIndices.profile))
  }, [selectedUser])

  useEffect(() => {
    if (selectedUser) {
      const allOptions = technologyLabels.flatMap(group => group.options)
      const formattedSkills = selectedUser.skills
        ?.map(skill => allOptions.find(option => option.value === skill))
        .filter(Boolean)

      const values = {
        firstname: selectedUser.name.split(' ')[0],
        lastname: selectedUser.name.split(' ')[1],
        gender: selectedUser.gender || '',
        dob: selectedUser.dob || '',
        phoneNumber: selectedUser.phoneNumber || '',
        addressLine1: selectedUser.addressLine1 || '',
        addressLine2: selectedUser.addressLine2 || '',
        city: selectedUser.city || '',
        code: selectedUser.code || '',
        state: selectedUser.state || '',
        country: selectedUser.country || '',
        skills: formattedSkills,
        profilePageUrl: selectedUser.profilePageUrl || ''
      }

      profileForm.setValues(values)
      initialFormValues.current = values
      setDataInitialized(true)
    }
  }, [selectedUser])

  useEffect(() => {
    setFile(null)
  }, [isEditing])

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
              {isEditing ? (
                <img className='profile-img' src={profileForm.values.profilePageUrl || defaultProfileImage} alt='' />
              ) : (
                <img className='profile-img' src={selectedUser.profilePageUrl || defaultProfileImage} alt='' />
              )}
              <div className="profile-heading">
                <p className='name' >{selectedUser.name}</p>
                <a href={`mailto:${selectedUser.emails[0]}`} className="opacity-5" >
                  {selectedUser.emails[0]}
                </a>
              </div>
              {isEditing && !file && (
                <div className="choose-file dark-btn pointer paper-1">
                  <label className='pointer' htmlFor="upload">
                    <MdImage />
                    <p>Choose Profile Picture</p>
                  </label>
                  <input
                    id='upload'
                    name='upload'
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={handleChoose}
                  />
                </div>
              )}
              {isEditing && file && (
                <div className="chip paper-1">
                  <TiDelete className='pointer' onClick={() => setFile(null)} />
                  <p>{file.name}</p>
                </div>
              )}
              {isEditing && file && (
                <button
                  className='pointer paper-1 dark-btn upload'
                  onClick={handleUpload}
                >
                  <FaUpload />
                  Upload Profile Picture
                </button>
              )}
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
                      disabled={profileForm.isSubmitting || !profileForm.isValid || isFormUnchanged()}
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
                      onClick={() => navigate('reset-password')}
                    >
                      <MdLockReset />
                      <p>Reset Password</p>
                    </button>
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
            {isEditing ? <ProfileForm profileForm={profileForm} dataInitialized={dataInitialized} /> : <ProfileDetails />}
          </div>
        </section>
      )}
    </section>
  )
}

export default Profile