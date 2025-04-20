import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

import metricApi from '../../api/modules/metrics.api'

const EXPERTISE_COLORS = {
  Beginner: 'rgba(56, 189, 248, 1)',
  Intermediate: 'rgba(59, 130, 246, 1)',
  Expert: 'rgba(126, 34, 206, 1)'
}

const OrganizationExpertise = () => {
  const { teamsMap } = useSelector((state) => state.teams)
  const { projects } = useSelector((state) => state.projects)

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!projects || projects.length === 0) return

    const fetchAllExpertise = async () => {
      setLoading(true)

      const results = await Promise.all(
        projects.map(async (projectId) => {
          const { res, err } = await metricApi.projectExpertise({ projectId })
          if (err) {
            toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')
            return null
          }
          return res.expertise || {}
        })
      )

      const combined = results.reduce((acc, curr) => {
        if (curr) {
          Object.entries(curr).forEach(([teamId, levels]) => {
            if (!acc[teamId]) acc[teamId] = { beginner: 0, intermediate: 0, expert: 0 }
            acc[teamId].beginner += levels.Beginner || 0
            acc[teamId].intermediate += levels.Intermediate || 0
            acc[teamId].expert += levels.Expert || 0
          })
        }
        return acc
      }, {})

      const formattedData = Object.entries(combined).map(([teamId, levels]) => {
        return {
          team: teamsMap[teamId]?.name || teamId,
          Beginner: (levels.beginner),
          Intermediate: (levels.intermediate),
          Expert: (levels.expert)
        }
      })

      setData(formattedData)
      setLoading(false)
    }

    fetchAllExpertise()
  }, [projects, teamsMap])

  return (
    <div className='chart'>
      <h2>Organization Expertise</h2>
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
              dataKey="team"
              label={{ value: 'Teams', position: 'insideBottom', offset: -30 }}
              height={30}
              tick={{ angle: -45, textAnchor: 'end' }}
            />
            <YAxis
              label={{ value: 'Expertise (%)', angle: -90, position: 'insideLeft', offset: -30 }}
              width={30}
            />
            <Tooltip formatter={(value) => `${value.toFixed(2)} %`}  />
            <Legend
              verticalAlign="top"
              align="center"
              height={30}
            />
            <Bar dataKey='Beginner' stackId='a' fill={EXPERTISE_COLORS.Beginner} />
            <Bar dataKey='Intermediate' stackId='a' fill={EXPERTISE_COLORS.Intermediate} />
            <Bar dataKey='Expert' stackId='a' fill={EXPERTISE_COLORS.Expert} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export default OrganizationExpertise