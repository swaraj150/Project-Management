import React, { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { toast } from 'react-toastify'

import metricApi from '../../api/modules/metrics.api'

const EXPERTISE_COLORS = {
  Beginner: 'rgba(56, 189, 248, 1)',
  Intermediate: 'rgba(59, 130, 246, 1)',
  Expert: 'rgba(126, 34, 206, 1)'
}

const TeamExpertise = ({ projectId, teamId }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchExpertise = async () => {
      setLoading(true)
      const { res, err } = await metricApi.teamExpertise({ projectId, teamId })
      if (res?.expertise) {
        const formatted = [
          { name: 'Beginner', value: res.expertise.Beginner },
          { name: 'Intermediate', value: res.expertise.Intermediate },
          { name: 'Expert', value: res.expertise.Expert }
        ].filter(item => item.value > 0)
        
        setData(formatted)
      }
      if (err) toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')
      setLoading(false)
    }

    fetchExpertise()
  }, [teamId])

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180)
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180)

    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
        {`${(percent * 100).toFixed(2)}%`}
      </text>
    )
  }

  return (
    <div className="chart">
      <h2>Team Expertise</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius="80%"
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={EXPERTISE_COLORS[entry.name]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export default TeamExpertise