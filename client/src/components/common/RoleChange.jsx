import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { FaArrowRightLong } from 'react-icons/fa6'

import userApi from '../../api/modules/user.api'

import { changeMemberRole } from '../../redux/features/organizationSlice'

import { assignableRoles } from '../../utils/organization.utils'

const RoleChange = ({ member, setModalOpen, modalRef }) => {
  const dispatch = useDispatch()

  const [selectedRole, setSelectedRole] = useState(member.projectRole)
  const [isRequested, setIsRequested] = useState(false)

  const handleSubmit = async () => {
    setIsRequested(true)

    const { res, err } = await userApi.updateProjectRole({ userId: member.id, role: selectedRole })

    if (res) {
      setIsRequested(false)
      setModalOpen(false)
      toast.success('Role updated successfully!')
      dispatch(changeMemberRole({ memberId: member.id, newRole: selectedRole }))
    }

    if (err) {
      setIsRequested(false)
      toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')
    }
  }

  return (
    <div ref={modalRef} className="modal paper">
      <div className="cta">
        <h3>Change member role</h3>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          {
            assignableRoles.map((role, index) => (
              <option key={index} value={role}>{role}</option>
            ))
          }
        </select>
      </div>
      <div className="member-info">
        <div className="member-details">
          <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" alt="" />
          <p>{member.name}</p>
        </div>
        {
          selectedRole !== member.projectRole ? (
            <div className="changed-role">
              <p className="opacity-5" >{member.projectRole}</p>
              <FaArrowRightLong className="opacity-5" />
              <p>{selectedRole}</p>
            </div>
          ) : null
        }
      </div>
      {
        selectedRole !== member.projectRole ? (
          <div className="cta-buttons">
            <button
              className="pointer paper-1"
              disabled={isRequested}
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="pointer paper-1"
              disabled={isRequested}
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        ) : null
      }
    </div>
  )
}

export default RoleChange