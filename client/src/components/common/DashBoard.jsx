import React from 'react'
import { useSelector } from 'react-redux'

const DashBoard = () => {
  const { user } = useSelector((state) => state.user)

  const getGreeting = () => {
    const currentHour = new Date().getHours()

    if (currentHour >= 5 && currentHour < 12) {
      return (
        <span>Good Morning</span>
      )
    } else if (currentHour >= 12 && currentHour < 17) {
      return (
        <span>Good Afternoon</span>
      )
    } else if (currentHour >= 17 && currentHour < 21) {
      return (
        <span>Good Evening</span>
      )
    } else {
      return (
        <span>Welcome</span>
      )
    }
  }

  return (
    <section id="dashboard">
      <h1>
        {getGreeting()}, <span>{user.username}</span>
      </h1>
    </section>
  )
}

export default DashBoard