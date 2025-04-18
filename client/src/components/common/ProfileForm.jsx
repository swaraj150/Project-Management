import React, { useEffect, useRef, useState } from 'react'
import Select from 'react-select'

import { useSelection } from '../../contexts/SelectionContext'

import { technologyLabels } from '../../utils/project.utils'

const ProfileForm = ({ profileForm }) => {

  const { selectedUser } = useSelection()

  const dobRef = useRef(null)
  const initialFormValues = useRef(null)

  const [dataInitialized, setDataInitialized] = useState(false)
  const [dobType, setDobType] = useState('text')

  useEffect(() => {
    const allOptions = technologyLabels.flatMap(group => group.options)
    const formattedSkills = selectedUser.skills
      .map(skill => allOptions.find(option => option.value === skill))
      .filter(Boolean)

    if (selectedUser) {
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
        skills: formattedSkills
      }

      profileForm.setValues(values)
      initialFormValues.current = values
      setDataInitialized(true)
    }
  }, [selectedUser])

  useEffect(() => {
    if (selectedUser?.dob) setDobType('date')
  }, [selectedUser])

  useEffect(() => {
    if (dataInitialized && profileForm.values.dob === '' && dobType === 'date' && dobRef.current) {
      dobRef.current.showPicker?.()
    }
  }, [dobType, profileForm.values.dob, dataInitialized])

  return (
    <form className='profile-form no-scrollbar'>
      <div className="group">
        <div className="input-field">
          <input
            className='paper-1'
            type='text'
            name='firstname'
            required
            placeholder='First name'
            value={profileForm.values.firstname}
            onChange={profileForm.handleChange}
            onBlur={profileForm.handleBlur}
          />
          <p className="helper-text opacity-5">
            {profileForm.touched.firstname && profileForm.errors.firstname ? profileForm.errors.firstname : ''}
          </p>
        </div>
        <div className="input-field">
          <input
            className='paper-1'
            type='text'
            name='lastname'
            required
            placeholder='Last name'
            value={profileForm.values.lastname}
            onChange={profileForm.handleChange}
            onBlur={profileForm.handleBlur}
          />
          <p className="helper-text opacity-5">
            {profileForm.touched.lastname && profileForm.errors.lastname ? profileForm.errors.lastname : ''}
          </p>
        </div>
      </div>
      <div className="group">
        <div className="input-field">
          <div className="radio paper-1">
            <label className="label">Gender</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={profileForm.values.gender === 'male'}
                  onChange={profileForm.handleChange}
                  onBlur={profileForm.handleBlur}
                />
                Male
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={profileForm.values.gender === 'female'}
                  onChange={profileForm.handleChange}
                  onBlur={profileForm.handleBlur}
                />
                Female
              </label>
            </div>
          </div>
          <p className="helper-text opacity-5">
            {profileForm.touched.gender && profileForm.errors.gender ? profileForm.errors.gender : ''}
          </p>
        </div>
        <div className="input-field">
          <input
            ref={dobRef}
            className='paper-1'
            type={dobType}
            name='dob'
            required
            placeholder='Enter date of birth'
            value={profileForm.values.dob}
            onChange={(e) => profileForm.setFieldValue('dob', e.target.value)}
            onBlur={(e) => {
              profileForm.handleBlur(e)
              if (!profileForm.values.dob) setDobType('text')
            }}
            onFocus={() => setDobType('date')}
          />
          <p className="helper-text opacity-5">
            {profileForm.touched.dob && profileForm.errors.dob ? profileForm.errors.dob : ''}
          </p>
        </div>
      </div>
      <div className="input-field">
        <Select
          className="paper-1 select"
          isMulti
          isSearchable
          isClearable
          options={technologyLabels}
          name='skills'
          placeholder="Select skills"
          value={profileForm.values.skills}
          onChange={(option) => profileForm.setFieldValue('skills', option)}
          onBlur={() => profileForm.setFieldTouched('skills', true)}
        />
        <p className="helper-text opacity-5">
          {profileForm.touched.skills && profileForm.errors.skills ? profileForm.errors.skills : ''}
        </p>
      </div>
      <div className="group">
        <div className="input-field">
          <input
            className='paper-1'
            type='text'
            name='addressLine1'
            required
            placeholder='Address line 1'
            value={profileForm.values.addressLine1}
            onChange={profileForm.handleChange}
            onBlur={profileForm.handleBlur}
          />
          <p className="helper-text opacity-5">
            {profileForm.touched.addressLine1 && profileForm.errors.addressLine1 ? profileForm.errors.addressLine1 : ''}
          </p>
        </div>
        <div className="input-field">
          <input
            className='paper-1'
            type='text'
            name='addressLine2'
            required
            placeholder='Address line 2'
            value={profileForm.values.addressLine2}
            onChange={profileForm.handleChange}
            onBlur={profileForm.handleBlur}
          />
          <p className="helper-text opacity-5">
            {profileForm.touched.addressLine2 && profileForm.errors.addressLine2 ? profileForm.errors.addressLine2 : ''}
          </p>
        </div>
      </div>
      <div className="group group-4">
        <div className="input-field">
          <input
            className='paper-1'
            type='text'
            name='city'
            required
            placeholder='City'
            value={profileForm.values.city}
            onChange={profileForm.handleChange}
            onBlur={profileForm.handleBlur}
          />
          <p className="helper-text opacity-5">
            {profileForm.touched.city && profileForm.errors.city ? profileForm.errors.city : ''}
          </p>
        </div>
        <div className="input-field">
          <input
            className='paper-1'
            type='text'
            name='code'
            required
            placeholder='Code'
            value={profileForm.values.code}
            onChange={profileForm.handleChange}
            onBlur={profileForm.handleBlur}
          />
          <p className="helper-text opacity-5">
            {profileForm.touched.code && profileForm.errors.code ? profileForm.errors.code : ''}
          </p>
        </div>
        <div className="input-field">
          <input
            className='paper-1'
            type='text'
            name='state'
            required
            placeholder='State'
            value={profileForm.values.state}
            onChange={profileForm.handleChange}
            onBlur={profileForm.handleBlur}
          />
          <p className="helper-text opacity-5">
            {profileForm.touched.state && profileForm.errors.state ? profileForm.errors.state : ''}
          </p>
        </div>
        <div className="input-field">
          <input
            className='paper-1'
            type='text'
            name='country'
            required
            placeholder='Country'
            value={profileForm.values.country}
            onChange={profileForm.handleChange}
            onBlur={profileForm.handleBlur}
          />
          <p className="helper-text opacity-5">
            {profileForm.touched.country && profileForm.errors.country ? profileForm.errors.country : ''}
          </p>
        </div>
      </div>
      <div className="input-field">
        <input
          className='paper-1'
          type='text'
          name='phoneNumber'
          required
          placeholder='Phone number'
          value={profileForm.values.phoneNumber}
          onChange={profileForm.handleChange}
          onBlur={profileForm.handleBlur}
        />
        <p className="helper-text opacity-5">
          {profileForm.touched.phoneNumber && profileForm.errors.phoneNumber ? profileForm.errors.phoneNumber : ''}
        </p>
      </div>
    </form>
  )
}

export default ProfileForm