import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

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
    <div className='chart'>
      <h2>Organization Workload</h2>
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
              label={{ value: 'Workload (Days)', angle: -90, position: 'insideLeft', offset: -30 }}
              width={30}
            />
            <Tooltip />
            <Bar dataKey='workload' fill='rgba(114, 146, 243, 1)' />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export default OrganizationWorkload