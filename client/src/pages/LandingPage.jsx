import React from 'react'
import { useNavigate } from 'react-router-dom'

import Logo from '../assets/logo.png'
import Dashboard from '../assets/dashboard.jpg'

const LandingPage = () => {
  const navigate = useNavigate()

  return (
    <section id="landing-page">
      <header>
        <div className="title">
          <img src={Logo} alt="logo" />
          <p>Project Maestro</p>
        </div>
        <div className="cta">
          <button className="cta-btn pointer animated-btn paper" onClick={() => navigate('/sign-in')}>
            <span> </span>
            <span> </span>
            <span> </span>
            <span> </span>
            Sign In
          </button>
          <button className="cta-btn pointer animated-btn paper" onClick={() => navigate('/sign-up')}>
            <span> </span>
            <span> </span>
            <span> </span>
            <span> </span>
            Sign Up
          </button>
        </div>
      </header>
      <section className="hero">
        <p className='tagline'>Organize your work, </p>
        <p className='tagline'>One task at a time</p>
        <p className='subtitle'>Goes beyond basic to-do lists, offering intuitive tools for prioritizing and managing tasks with ease.</p>
        <div className="img-container">
          <img src={Dashboard} alt="" />
          <div className="gradient"></div>
        </div>
      </section>
    </section>
  )
}

export default LandingPage