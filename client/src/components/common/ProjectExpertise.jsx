import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { toast } from 'react-toastify'

import metricApi from '../../api/modules/metrics.api'

const EXPERTISE_COLORS = {
  Beginner: 'rgba(56, 189, 248, 1)',
  Intermediate: 'rgba(59, 130, 246, 1)',
  Expert: 'rgba(126, 34, 206, 1)'
}

const ProjectExpertise = ({ projectId }) => {
  const { teamsMap } = useSelector((state) => state.teams)

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchExpertise = async () => {
      setLoading(true)
      const { res, err } = await metricApi.projectExpertise({ projectId })
      if (res?.expertise) {
        const formatted = Object.entries(res.expertise).map(([teamId, levels]) => {
          return {
            team: teamsMap[teamId]?.name || teamId,
            Beginner: levels.Beginner || 0,
            Intermediate: levels.Intermediate || 0,
            Expert: levels.Expert || 0,
          }
        })
        setData(formatted)
        console.log(formatted)
      }
      if (err) {
        toast.error(typeof err === 'string' ? err : 'An error occurred. Please try again.')
      }
      setLoading(false)
    }

    fetchExpertise()
  }, [projectId, teamsMap])

  return (
    <div className='chart'>
      <h2>Project Expertise</h2>
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
            <Tooltip />
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

export default ProjectExpertise