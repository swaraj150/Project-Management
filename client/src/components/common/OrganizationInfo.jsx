import React from 'react'
import { GrGroup } from 'react-icons/gr'
import { CiGlobe } from 'react-icons/ci'
import { FiTarget } from 'react-icons/fi'

const OrganizationInfo = () => {
  return (
    <section className="info">
      <h2>Why Organizations Matter</h2>
      <div className='cards'>
        <div className='paper-1'>
          <div className="title">
            <GrGroup />
            <h3>Collective Power</h3>
          </div>
          <p>Organizations harness the collective power of individuals, turning shared goals into tangible achievements. Together, we can accomplish what's impossible alone.</p>
        </div>
        <div className='paper-1'>
          <div className="title">
            <CiGlobe />
            <h3>Broader Impact</h3>
          </div>
          <p>Through organizations, your efforts can reach further and impact more lives. Be part of something bigger than yourself and create lasting change in the world.</p>
        </div>
        <div className='paper-1'>
          <div className="title">
            <FiTarget />
            <h3>Focused Growth</h3>
          </div>
          <p>Organizations provide structure and focus, helping you channel your passion and skills effectively. Grow personally and professionally alongside like-minded individuals.</p>
        </div>
      </div>
      <section className="info-card">
        <h2>The Power of Coming Together</h2>
        <p>In today's interconnected world, the ability to collaborate and work towards common goals has never been more crucial. Organizations serve as the backbone of progress, innovation, and social change. They provide:</p>
        <ul>
          <li>A platform for shared ideas and diverse perspectives</li>
          <li>Resources and support to turn visions into reality</li>
          <li>Opportunities for leadership and personal development</li>
          <li>A sense of belonging and community</li>
          <li>The means to tackle complex challenges collectively</li>
        </ul>
        <p>Whether you're passionate about technology, social justice, environmental conservation, or any other cause, joining or creating an organization amplifies your voice and extends your reach. It's not just about what you can gain, but what you can contribute to a larger purpose.</p>
      </section>
    </section>
  )
}

export default OrganizationInfo