import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { RxCross1 } from 'react-icons/rx'

import organizationApi from '../../api/modules/organization.api'

import { setOrganization } from '../../redux/features/organizationSlice'

const CreateOrganization = ({ setCreateModalOpen, modalRef }) => {
  const dispatch = useDispatch()

  const [name, setName] = useState(null)
  const [disabled, setDisabled] = useState(true)

  const handleCreate = async () => {
    setDisabled(true)

    const { res, err } = await organizationApi.create({ name })

    if (res) {
      dispatch(setOrganization(res))
      setCreateModalOpen(false)
      navigate('/dashboard')
      toast.success('Organization joined successfully!')
    }

    if (err) {
      setDisabled(false)
      toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')
    }
  }

  useEffect(() => {
    setDisabled(!name)
  }, [name])

  return (
    <div ref={modalRef} className="modal paper">
      <RxCross1 className="modal-close pointer" onClick={() => setCreateModalOpen(false)} />
      <h2>Create Organization</h2>
      <input
        className='paper-1'
        type='text'
        name='name'
        required
        placeholder='Enter organization name'
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <div className="cta-group">
        <button className="paper-1 pointer" onClick={() => setCreateModalOpen(false)}>Cancel</button>
        <button className="paper-1 pointer" onClick={handleCreate} disabled={disabled} >Create</button>
      </div>
    </div >
  )
}

export default CreateOrganization