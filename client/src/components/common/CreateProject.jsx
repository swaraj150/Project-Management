import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { RxCross1 } from 'react-icons/rx'

import projectsApi from '../../api/modules/projects.api'

import { addProject } from '../../redux/features/projectsSlice'

const CreateProject = ({ setModalOpen, modalRef }) => {
  const dispatch = useDispatch()

  const [title, settitle] = useState('')
  const [description, setDescription] = useState('')
  const [estimatedEndDate, setEstimatedEndDate] = useState('')
  const [budget, setBudget] = useState(null)
  const [disabled, setDisabled] = useState(true)

  useEffect(() => {
    setDisabled(!(title && description && estimatedEndDate && budget))
  }, [title, description, estimatedEndDate, budget])

  const handleCreate = async () => {
    setDisabled(true)

    const { res, err } = await projectsApi.create({ title, description, estimatedEndDate, budget })

    if (res) {
      dispatch(addProject(res))
      setModalOpen(false)
      toast.success('Project created successfully!')
    }

    if (err) {
      setDisabled(false)
      toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')
    }
  }

  return (
    <div ref={modalRef} className="modal paper">
      <RxCross1 className="modal-close pointer" onClick={() => setModalOpen(false)} />
        <h2>Create new project</h2>
      <input
        className='paper-1'
        type='text'
        name='name'
        required
        placeholder='Enter project title'
        value={title}
        onChange={(e) => settitle(e.target.value)}
      />
      <textarea
        className='paper-1 no-scrollbar'
        type='text'
        rows={1}
        name='name'
        required
        placeholder='Enter project description'
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        className='paper-1'
        type='date'
        name='name'
        required
        placeholder='Enter estimated end date'
        value={estimatedEndDate}
        onChange={(e) => setEstimatedEndDate(e.target.value)}
      />
      <input
        className='paper-1'
        type='number'
        min={0}
        name='name'
        required
        placeholder='Enter budget'
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
      />
      <div className="cta">
        <button className="paper-1 pointer" onClick={() => setModalOpen(false)}>Cancel</button>
        <button className="paper-1 pointer" onClick={handleCreate} disabled={disabled} >Create</button>
      </div>
    </div>
  )
}

export default CreateProject