import React from 'react'

import WelcomeImage from '../../assets/welcome.png'

const Welcome = () => {
  return (
    <section className='welcome'>
      <div className='info paper'>
        <h1>Welcome to <br /> Project Maestro</h1>
        <p>Empower your projects with seamless collaboration and efficient task management. Project Maestro offers intuitive tools to help you stay on track. Sign in or create an account to get started!</p>
      </div>
      <img src={WelcomeImage} alt='' />
    </section>
  )
}

export default Welcome