import React from 'react'
import { useDispatch } from 'react-redux'
import { MdOutlineGroup } from 'react-icons/md'
import { FaRegLightbulb, FaArrowRight } from 'react-icons/fa'
import { LuRocket, LuPuzzle } from 'react-icons/lu'
import { HiOutlineLightningBolt } from 'react-icons/hi'
import { FiTarget } from 'react-icons/fi'

import { setActive } from '../../redux/features/menuSlice'

const ProjectsInfo = () => {
  const dispatch = useDispatch()

  return (
    <section className='info'>
      <h1 className='h1'>Unlock the Power of Collaboration</h1>
      <p>You're not currently part of an organization. Join one to access exciting projects and collaborate with amazing teams!</p>
      <div className="points">
        <div className='paper'>
          <MdOutlineGroup style={{ color: 'blue' }} />
          <h3>Alone we can do so little; together we can do so much.</h3>
        </div>
        <div className='paper'>
          <FaRegLightbulb style={{ color: 'yellow' }} />
          <h3>Innovation is taking two things that exist and putting them together in a new way.</h3>
        </div>
        <div className='paper'>
          <LuRocket style={{ color: 'red' }} />
          <h3>The best way to predict the future is to create it.</h3>
        </div>
        <div className='paper'>
          <HiOutlineLightningBolt style={{ color: 'purple' }} />
          <h3>Teamwork makes the dream work.</h3>
        </div>
        <div className='paper'>
          <FiTarget style={{ color: 'green' }} />
          <h3>Coming together is a beginning. Keeping together is progress. Working together is success.</h3>
        </div>
        <div className='paper'>
          <LuPuzzle style={{ color: 'blue' }} />
          <h3>Collaboration is the key to unlocking innovation.</h3>
        </div>
      </div>
      <div className="cta-btn pointer" onClick={() => dispatch(setActive(1))}>
        Join Organization
        <FaArrowRight />
      </div>
      <div className="list">
        <h2>Why Join an Organization?</h2>
        <ul>
          <li>Access to exciting projects and opportunities</li>
          <li>Collaborate with talented professionals</li>
          <li>Collaborate with talented professionals</li>
          <li>Be part of innovative solutions</li>
          <li>Network with industry leaders</li>
        </ul>
      </div>
    </section>
  )
}

export default ProjectsInfo