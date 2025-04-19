import privateClient from "../clients/private.client"

const metricsEndPoints = {
  projectWorkload: 'projects/workload',
  projectExpertise: 'projects/expertise',
  projectStatus: 'projects/status',
  projectSummary: 'projects/summary',
  userPerformance: 'users/performance',
  teamExpertise: 'teams/expertise'
}

const metricApi = {
 projectWorkload: async ({ projectId }) => {
  try {
    const res = await privateClient.get(
      metricsEndPoints.projectWorkload,
      { params: { projectId } }
    )
    return { res }
  } catch (err) {
    return { err }
  }
 },
 projectExpertise: async ({ projectId }) => {
  try {
    const res = await privateClient.get(
      metricsEndPoints.projectExpertise,
      { params: { projectId } }
    )
    return { res }
  } catch (err) {
    return { err }
  }
 },
 projectStatus: async ({ projectId }) => {
  try {
    const res = await privateClient.get(
      metricsEndPoints.projectStatus,
      { params: { projectId } }
    )
    return { res }
  } catch (err) {
    return { err }
  }
 },
 projectSummary: async () => {
  try {
    const res = await privateClient.get(metricsEndPoints.projectSummary)
    return { res }
  } catch (err) {
    return { err }
  }
 },
 userPerformance: async ({ projectId, userId }) => {
  try {
    const res = await privateClient.get(
      metricsEndPoints.userPerformance,
      { params: { projectId, userId } }
    )
    return { res }
  } catch (err) {
    return { err }
  }
 },
 teamExpertise: async ({ projectId, teamId }) => {
  try {
    const res = await privateClient.get(
      metricsEndPoints.teamExpertise,
      { params: { projectId, teamId } }
    )
    return { res }
  } catch (err) {
    return { err }
  }
 }
}

export default metricApi