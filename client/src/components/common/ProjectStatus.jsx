import React, { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { toast } from 'react-toastify'

import metricApi from '../../api/modules/metrics.api'

const STATUS_COLORS = {
  'Pending Tasks': 'rgba(253, 224, 71, 1)',
  'In Progress Tasks': 'rgba(96, 165, 250, 1)',
  'Completed Tasks': 'rgba(74, 222, 128, 1)'
}

const ProjectStatus = ({ projectId }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchWorkload = async () => {
      setLoading(true)
      const { res, err } = await metricApi.projectStatus({ projectId })
      if (res?.status) {
        const formatted = [
          { name: 'Pending Tasks', value: res.status["pending tasks"] },
          { name: 'In Progress Tasks', value: res.status["in progress tasks"] },
          { name: 'Completed Tasks', value: res.status["completed tasks"] }
        ].filter(item => item.value > 0)
        setData(formatted)
      }
      if (err) toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')
      setLoading(false)
    }


    fetchWorkload()
  }, [projectId])

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180)
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180)

    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <div className="chart">
      <h2>Project Status</h2>
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
                <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export default ProjectStatus