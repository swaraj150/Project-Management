import React from 'react'
import { useSelector } from 'react-redux'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'

const ProjectWorkload = ({ project, workload }) => {
  const { teamsMap } = useSelector((state) => state.teams)

  const data = Object.entries(workload).map(([teamId, value]) => ({
    team: teamsMap[teamId].name,
    workload: value
  }))

  return (
    <div className='project-workload'>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx='50%' cy='50%' outerRadius='80%' data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey='team' />
          <PolarRadiusAxis />
          <Radar
            name='Workload'
            dataKey='workload'
            stroke='rgba(67, 110, 239, 1)'
            fill='rgba(161, 183, 247, 1)'
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
      <h3>{project} Workload</h3>
    </div>
  )
}

export default ProjectWorkload