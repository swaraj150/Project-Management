import React from 'react'
import { useSelector } from 'react-redux'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const PriorityDistribution = ({ priorityDistribution }) => {
  const { teamsMap } = useSelector((state) => state.teams)

  const chartData = []

  Object.entries(priorityDistribution).forEach(([projectId, tasks]) => {
    Object.entries(tasks).forEach(([teamId, priorities]) => {
      chartData.push({
        name: teamsMap[teamId].name,
        low: priorities.low,
        normal: priorities.normal,
        high: priorities.high,
      })
    })
  })

  return (
    <div className='priority-distribution'>
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='name' />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey='low' fill='rgba(67, 110, 239, 1)' name='Low Priority' />
          <Bar dataKey='normal' fill='rgba(67, 239, 239, 1)' name='Normal Priority' />
          <Bar dataKey='high' fill='rgba(239, 67, 201, 1)' name='High Priority' />
        </BarChart>
      </ResponsiveContainer>
      <h3>Priority Distribution</h3>
    </div>
  )
}

export default PriorityDistribution