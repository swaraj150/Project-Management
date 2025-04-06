import privateClient from '../clients/private.client'

const teamsEndpoints = {
  create: 'teams',
  getInfo: (teamId) => `teams/${teamId}`,
  getAll: 'teams',
  suggest: 'teams/suggestions',
}

const teamsApi = {
  create: async ({ name, developers, testers, teamLead }) => {
    try {
      const res = await privateClient.post(
        teamsEndpoints.create,
        { name, developers, testers, teamLead }
      )
      return { res }
    } catch (err) {
      return { err }
    }
  },
  getInfo: async ({ teamId }) => {
    try {
      const res = await privateClient.get(teamsEndpoints.getInfo(teamId))
      return { res }
    } catch (err) {
      return { err }
    }
  },
  getAll: async () => {
    try {
      const res = await privateClient.get(teamsEndpoints.getAll)
      return { res }
    } catch (err) {
      return { err }
    }
  },
  suggest: async (projectId) => {
    try {
      const res = await privateClient.get(
        teamsEndpoints.suggest,
        { params: { projectId: projectId } }
      )
      return { res }
    }
    catch (err) {
      return { err }
    }
  }
}

export default teamsApi