import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { IoMdSearch } from 'react-icons/io'
import { RxCross2 } from 'react-icons/rx'
import { toast } from 'react-toastify'

import organizationApi from '../../api/modules/organization.api'

import OrganizationImg from '../../assets/organization.png'

import { setOrganization } from '../../redux/features/organizationSlice'

const OrganizationHero = () => {
  const dispatch = useDispatch()

  const [name, setName] = useState('')
  const [createDisabled, setCreateDisabled] = useState(false)
  const [query, setQuery] = useState('')
  const [code, setCode] = useState('')
  const [joinDisabled, setJoinDisabled] = useState(false)
  const [list, setList] = useState([])
  const [selected, setSelected] = useState(false)

  useEffect(() => {
    const getList = async () => {
      const { res, err } = await organizationApi.search({ query })

      if (res) setList(res)

      if (err) {
        setList([])
        toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')
      }
    }

    if (query.length !== 0) getList()
  }, [query])

  const handleNewOrganization = async () => {
    const newOrganization = async () => {
      const { res, err } = await organizationApi.create({ name })

      if (res) {
        dispatch(setOrganization(res))
        toast.success(`${name} was created successfully!`)
      }

      if (err) toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')

      setCreateDisabled(false)
      setName('')
    }

    if (name.length !== 0) {
      setCreateDisabled(true)
      newOrganization()
    }
  }

  const handleJoinOrganization = async () => {
    const joinOrganization = async () => {
      const { res, err } = await organizationApi.join({ code })

      if (res) {
        dispatch(setOrganization(res))
        toast.success(`${name} joined successfully!`)
      }

      if (err) toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')

      setJoinDisabled(false)
      setCode('')
    }

    if (code.length !== 0) {
      setJoinDisabled(true)
      joinOrganization()
    }
  }

  const handleQuery = (item) => {
    setQuery(item.name)
    setCode(item.code)
    setList([])
    setSelected(true)
  }

  const handleDiscard = () => {
    setSelected(false)
    setQuery('')
    setCode('')
  }

  return (
    <section className="hero">
      <h2>Ready to Make a Difference?</h2>
      <p>Whether you have a vision to bring to life or want to contribute to an existing cause, there's a place for you in an organization. Take the first step today – create or join an organization and be part of something extraordinary.</p>
      <div className="group">
        <div className='cta-group'>
          <div className='paper cta'>
            <h3>Create an organization</h3>
            <p>Start your own organization and invite others to join.</p>
            <input
              type='text'
              placeholder='Enter organization name'
              className='paper-1'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div
              className={createDisabled ? 'cta-btn paper' : 'cta-btn pointer paper'}
              onClick={createDisabled ? null : handleNewOrganization}
            >
              Create organization
            </div>
          </div>
          <div className='paper cta'>
            <h3>Join an organization</h3>
            <p>Search for existing organizations or enter an invitation code.</p>
            <div className='searchbar'>
              <input
                type='text'
                placeholder='Search organizations...'
                className='paper-1'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <div className='icon pointer'>
                {
                  selected ? (
                    <RxCross2 onClick={handleDiscard} />
                  ) : (
                    <IoMdSearch />
                  )
                }
              </div>
            </div>
            {
              list.length > 0 && (
                <ul className='list no-scrollbar paper-1'>
                  {
                    list.map((item, index) => (
                      <li className='pointer' onClick={() => handleQuery(item)}>{item.name}</li>
                    ))
                  }
                </ul>
              )
            }
            <p style={{ textAlign: 'center' }}>or</p>
            <input
              type='text'
              placeholder='Enter code'
              className='paper-1'
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <div
              className={joinDisabled ? 'cta-btn paper' : 'cta-btn pointer paper'}
              onClick={joinDisabled ? null : handleJoinOrganization}
            >Join organization</div>
          </div>
        </div>
        <img src={OrganizationImg} alt="" />
      </div>
    </section >
  )
}

export default OrganizationHero