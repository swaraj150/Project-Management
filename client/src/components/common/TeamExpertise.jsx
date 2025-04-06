import React, { useEffect } from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const EXPERTISE_COLORS = {
  beginner: 'rgba(67, 110, 239, 1)',
  intermediate: 'rgba(67, 239, 239, 1)',
  expert: 'rgba(239, 67, 201, 1)',
}

const TeamExpertise = ({ team, expertise }) => {  
  const data = Object.entries(expertise).map(([level, value]) => ({
    name: level.charAt(0).toUpperCase() + level.slice(1),
    value,
    color: EXPERTISE_COLORS[level]
  }))

  return (
    <div className='team-expertise'>
      <ResponsiveContainer width='100%' height='100%'>
        <PieChart>
          <Pie
            data={data}
            cx='50%'
            cy='50%'
            outerRadius='80%'
            dataKey='value'
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <h3>{team} Expertise</h3>
    </div>
  )
}

export default TeamExpertise