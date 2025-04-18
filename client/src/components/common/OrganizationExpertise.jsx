import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

import metricApi from '../../api/modules/metrics.api'

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
            acc[teamId].beginner += levels.beginner || 0
            acc[teamId].intermediate += levels.intermediate || 0
            acc[teamId].expert += levels.expert || 0
          })
        }
        return acc
      }, {})

      const formattedData = Object.entries(combined).map(([teamId, levels]) => {
        const total = levels.beginner + levels.intermediate + levels.expert || 1
        return {
          team: teamsMap[teamId]?.name || teamId,
          Beginner: ((levels.beginner / total) * 100).toFixed(2),
          Intermediate: ((levels.intermediate / total) * 100).toFixed(2),
          Expert: ((levels.expert / total) * 100).toFixed(2)
        }
      })

      setData(formattedData)
      setLoading(false)
    }

    fetchAllExpertise()
  }, [projects, teamsMap])

  return (
    <div className='organization-expertise'>
      <h2>Organization Expertise</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='team' label={{ value: 'Teams', position: 'bottom', offset: 10 }} />
            <YAxis label={{ value: 'Expertise (%)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey='Beginner' stackId='a' fill='#8884d8' />
            <Bar dataKey='Intermediate' stackId='a' fill='#82ca9d' />
            <Bar dataKey='Expert' stackId='a' fill='#ffc658' />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export default OrganizationExpertise