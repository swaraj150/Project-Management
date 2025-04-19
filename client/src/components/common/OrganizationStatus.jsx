import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

import metricApi from '../../api/modules/metrics.api'

const STATUS_COLORS = {
  'Pending': 'rgba(253, 224, 71, 1)',
  'In Progress': 'rgba(96, 165, 250, 1)',
  'Completed': 'rgba(74, 222, 128, 1)'
}

const OrganizationStatus = () => {
  const { projects, projectsMap } = useSelector((state) => state.projects)

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!projects || projects.length === 0) return

    const fetchAllExpertise = async () => {
      setLoading(true)

      const results = await Promise.all(
        projects.map(async (projectId) => {
          const { res, err } = await metricApi.projectStatus({ projectId })
          if (err) {
            toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')
            return null
          }
          return {
            project: projectsMap[projectId]?.title || projectId,
            Pending: res.status["pending tasks"] || 0,
            "In Progress": res.status["in progress tasks"] || 0,
            Completed: res.status["completed tasks"] || 0
          }
        })
      )

      setData(results.filter(Boolean))
      setLoading(false)
    }

    fetchAllExpertise()
  }, [projects, projectsMap])

  return (
    <div className='chart'>
      <h2>Organization Status</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart
            data={data}
            margin={{ left: 40, bottom: 50 }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis
              dataKey="project"
              label={{ value: 'Projects', position: 'insideBottom', offset: -50 }}
              height={30}
              tick={{ angle: -45, textAnchor: 'end' }}
            />
            <YAxis
              label={{ value: 'Tasks (%)', angle: -90, position: 'insideLeft', offset: -30 }}
              width={30}
            />
            <Tooltip />
            <Legend
              verticalAlign="top"
              align="center"
              height={30}
            />
            <Bar dataKey='Pending' stackId='a' fill={STATUS_COLORS.Pending} />
            <Bar dataKey='In Progress' stackId='a' fill={STATUS_COLORS['In Progress']} />
            <Bar dataKey='Completed' stackId='a' fill={STATUS_COLORS.Completed} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export default OrganizationStatus