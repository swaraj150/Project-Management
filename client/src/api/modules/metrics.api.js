import privateClient from "../clients/private.client"

const metricsEndPoints = {
  loadMetrics: 'metric/'
}

const metricApi = {
  load: async ({ projectId }) => {
    try {
      const res = privateClient.get(
        metricsEndPoints.loadMetrics,
        { params: { projectId } }
      )
      return { res }
    } catch (err) {
      return { err }
    }
  }
}

export default metricApi