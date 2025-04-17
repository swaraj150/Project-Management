import React from 'react'
import { useSelection } from '../../contexts/SelectionContext'

const ProfileDetails = () => {
  const { selectedUser } = useSelection()

  return (
    <div className="profile-details no-scrollbar">
      <div className="group">
        <div className="field">
          <p className="label opacity-7">First Name</p>
          <p className="paper-1">{selectedUser.name?.split(' ')[0]}</p>
        </div>
        <div className="field">
          <p className="label opacity-7">Last Name</p>
          <p className="paper-1">{selectedUser.name?.split(' ')[1]}</p>
        </div>
      </div>
      <div className="group">
        <div className="field">
          <p className="label opacity-7">Gender</p>
          <p className="paper-1">{selectedUser.gender || 'Gender not specified'}</p>
        </div>
        <div className="field">
          <p className="label opacity-7">Date of Birth</p>
          <p className="paper-1">{selectedUser.dob || 'Date of birth not available'}</p>
        </div>
      </div>
      <div className="group">
        <div className="field">
          <p className="label opacity-7">Address Line 1</p>
          <p className="paper-1">{selectedUser.addressLine1 || 'Address Line 1 missing'}</p>
        </div>
        <div className="field">
          <p className="label opacity-7">Address Line 2</p>
          <p className="paper-1">{selectedUser.addressLine2 || 'Address Line 2 missing'}</p>
        </div>
      </div>
      <div className="group">
        <div className="field">
          <p className="label opacity-7">City</p>
          <p className="paper-1">{selectedUser.city || 'City not provided'}</p>
        </div>
        <div className="field">
          <p className="label opacity-7">Postal/ZIP Code</p>
          <p className="paper-1">{selectedUser.code || 'Postal/ZIP code not available'}</p>
        </div>
      </div>
      <div className="group">
        <div className="field">
          <p className="label opacity-7">State</p>
          <p className="paper-1">{selectedUser.state || 'State not provided'}</p>
        </div>
        <div className="field">
          <p className="label opacity-7">Country</p>
          <p className="paper-1">{selectedUser.country || 'Country not provided'}</p>
        </div>
      </div>
      <div className="field">
        <p className="label opacity-7">Skills</p>
        <p className="paper-1">
          {selectedUser.skills && selectedUser.skills.length > 0
            ? selectedUser.skills.join(', ')
            : 'No skills added yet'}
        </p>
      </div>
    </div>
  )
}

export default ProfileDetails