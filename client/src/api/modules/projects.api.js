import privateClient from  '../clients/private.client'

const projectsEndpoints = {
  create: 'projects/create',
  getInfo: 'projects',
  getAll: 'projects/getAllProjects',
  addTeam: 'projects/add-team'
}

const projectsApi = {
  create: async ({ title, description, estimatedEndDate, budget }) => {
    try {
      const res = await privateClient.post(
        projectsEndpoints.create,
        { title, description, estimatedEndDate, budget }
      )

      return { res }
    } catch (err) {
      return { err }
    }
  },
  getInfo: async ({ projectId }) => {
    const res = await privateClient.get(
      projectsEndpoints.getInfo,
      { params: { projectId } }
    )
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
      const res = await privateClient.put(
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