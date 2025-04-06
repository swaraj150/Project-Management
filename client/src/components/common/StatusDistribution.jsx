import React from 'react'
import { useSelector } from 'react-redux'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const STATUS_COLORS = {
  pending: 'rgba(243, 114, 215, 1)',
  inProgress: 'rgba(67, 239, 239, 1)',
  completed: 'rgba(10, 36, 114, 1)'
}

const StatusDistribution = ({ statusDistribution }) => {
  const { projectsMap } = useSelector((state) => state.projects)

  const chartData = Object.entries(statusDistribution).map(([projectId, statuses]) => {
    const aggregated = { name: projectsMap[projectId].title }

    for (const taskId in statuses) {
      const { pending = 0, inProgress = 0, completed = 0 } = statuses[taskId]
      aggregated.pending = (aggregated.pending || 0) + pending
      aggregated.inProgress = (aggregated.inProgress || 0) + inProgress
      aggregated.completed = (aggregated.completed || 0) + completed
    }

    return aggregated
  })

  return (
    <div className='status-distribution'>
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey='name' />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey='pending' stackId='a' fill={STATUS_COLORS.pending} />
          <Bar dataKey='inProgress' stackId='a' fill={STATUS_COLORS.inProgress} />
          <Bar dataKey='completed' stackId='a' fill={STATUS_COLORS.completed} />
        </BarChart>
      </ResponsiveContainer>
      <h3>Status Distribution</h3>
    </div>
  )
}

export default StatusDistribution