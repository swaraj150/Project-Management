import privateClient from  '../clients/private.client'

const teamsEndpoints = {
  getAll: 'teams/getAllTeams'
}

const teamsApi = {
  getAll: async () => {
    try {
      const res = await privateClient.get(teamsEndpoints.getAll)

      return { res }
    } catch (err) {
      return { err }
    }
  }
}

export default teamsApi