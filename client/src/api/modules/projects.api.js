import privateClient from '../clients/private.client'

const projectsEndpoints = {
  create: 'projects',
  getInfo: (projectId) => `projects/${projectId}`,
  getAll: 'projects',
  addTeam: 'projects/teams'
}

const projectsApi = {
  create: async ({ title, description, estimatedEndDate, budget, projectManagerId }) => {
    try {
      const res = await privateClient.post(
        projectsEndpoints.create,
        { title, description, estimatedEndDate, budget, projectManagerId }
      )
      return { res }
    } catch (err) {
      return { err }
    }
  },
  getInfo: async ({ projectId }) => {
    try {
      const res = await privateClient.get(projectsEndpoints.getInfo(projectId))
      return { res }
    } catch (err) {
      return { err }
    }
  },
  getAll: async () => {
    try {
      const res = await privateClient.get(projectsEndpoints.getAll)
      return { res }
    } catch (err) {
      return { err }
    }
  },
  addTeam: async ({ projectId, teams }) => {
    try {
      const res = await privateClient.patch(
        projectsEndpoints.addTeam,
        { projectId, teams }
      )
      return { res }
    } catch (err) {
      return { err }
    }
  }
}

export default projectsApi