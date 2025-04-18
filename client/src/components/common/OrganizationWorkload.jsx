import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

import metricApi from '../../api/modules/metrics.api'

const OrganizationWorkload = () => {
  const { teamsMap } = useSelector((state) => state.teams)
  const { projects } = useSelector((state) => state.projects)

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!projects || projects.length === 0) return

    const fetchAllWorkloads = async () => {
      setLoading(true)

      const results = await Promise.all(
        projects.map(async (projectId) => {
          const { res, err } = await metricApi.projectWorkload({ projectId })
          if (err) {
            toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')
            return null
          }
          return res.workload || {}
        })
      )

      const combinedWorkload = results.reduce((acc, curr) => {
        if (curr) {
          Object.entries(curr).forEach(([teamId, value]) => {
            acc[teamId] = (acc[teamId] || 0) + value
          })
        }
        return acc
      }, {})

      const formattedData = Object.entries(combinedWorkload).map(([teamId, workload]) => ({
        team: teamsMap[teamId].name,
        workload
      }))

      setData(formattedData)
      setLoading(false)
    }

    fetchAllWorkloads()
  }, [projects, teamsMap])

  return (
    <div className='organization-workload'>
      <h2>Organization Workload</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="team" label={{ value: 'Teams', position: 'insideBottom', offset: 0 }} />
            <YAxis label={{ value: 'Workload (Days)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="workload" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export default OrganizationWorkload