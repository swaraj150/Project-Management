import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, LabelList, Tooltip } from 'recharts'

import metricApi from '../../api/modules/metrics.api'

const ProjectWorkload = ({ projectId }) => {
  const { teamsMap } = useSelector((state) => state.teams)

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchWorkload = async () => {
      setLoading(true)
      const { res, err } = await metricApi.projectWorkload({ projectId })
      if (res?.workload) {
        const formatted = Object.entries(res.workload).map(([teamId, workload]) => ({
          team: teamsMap[teamId]?.name || teamId,
          workload
        }))
        setData(formatted)
      }
      if (err) toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')
      setLoading(false)
    }


    fetchWorkload()
  }, [projectId, teamsMap])

  return (
    <div className='chart'>
      <h2>Organization Workload</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx='50%' cy='50%' outerRadius='80%' data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey='team' />
            <PolarRadiusAxis />
            <Radar
              name='Workload'
              dataKey='workload'
              stroke='rgba(59, 130, 246, 1)'
              fill='rgba(59, 130, 246, 0.3)'
              fillOpacity={0.6}
            >
              <LabelList dataKey="workload" position="top" />
            </Radar>
            <Tooltip formatter={(value) => `${value} days`} />
          </RadarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export default ProjectWorkload