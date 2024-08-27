import React from 'react'

import Welcome from '../components/common/Welcome'
import SigninForm from '../components/common/SigninForm'

const SigninPage = () => {
  return (
    <main>
      <section className='signin'>
        <Welcome />
        <SigninForm />
      </section>
    </main>
  )
}

export default SigninPage