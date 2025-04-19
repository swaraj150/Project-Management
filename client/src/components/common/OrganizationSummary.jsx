import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { toast } from 'react-toastify'

import metricApi from '../../api/modules/metrics.api'

const PRIORITY_COLORS = {
  Low: 'rgba(96, 165, 250, 1)',
  Normal: 'rgba(251, 191, 36, 1)',
  High: 'rgba(248, 113, 113, 1)'
}

const OrganizationSummary = () => {
  const { projectsMap } = useSelector((state) => state.projects)

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchExpertise = async () => {
      setLoading(true)
      const { res, err } = await metricApi.projectSummary()
      if (res?.priority) {
        const formatted = Object.entries(res.priority).map(([projectId, { Low, Normal, High}]) => {
          return {
            project: projectsMap[projectId]?.title || projectId,
            Low: Low || 0,
            Normal: Normal || 0,
            High: High || 0,
          }
        })
        setData(formatted)
      }
      if (err) {
        toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')
      }
      setLoading(false)
    }

    fetchExpertise()
  }, [projectsMap])

  return (
    <div className='chart'>
      <h2>Project Summary</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart
            data={data}
            margin={{ left: 40, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis
              dataKey="project"
              label={{ value: 'Projects', position: 'insideBottom', offset: -30 }}
              height={30}
              tick={{ angle: -45, textAnchor: 'end' }}
            />
            <YAxis
              label={{ value: 'Priority Distribution (%)', angle: -90, position: 'insideLeft', offset: -30 }}
              width={30}
            />
            <Tooltip />
            <Legend
              verticalAlign="top"
              align="center"
              height={30}
            />
            <Bar dataKey='Low' stackId='a' fill={PRIORITY_COLORS.Low} />
            <Bar dataKey='Normal' stackId='a' fill={PRIORITY_COLORS.Normal} />
            <Bar dataKey='High' stackId='a' fill={PRIORITY_COLORS.High} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export default OrganizationSummary