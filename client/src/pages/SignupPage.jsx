import React from 'react'

import Welcome from '../components/common/Welcome'
import SignupForm from '../components/common/SignupForm'

const SignupPage = () => {
  return (
    <section className='signin'>
      <Welcome />
      <SignupForm />
    </section>
  )
}

export default SignupPage