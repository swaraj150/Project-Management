import privateClient from  '../clients/private.client'

const teamsEndpoints = {
  getAll: 'teams/getAllTeams',
  create: 'teams/create',
  suggest: 'teams/suggest/project',
}

const teamsApi = {
  getAll: async () => {
    try {
      const res = await privateClient.get(teamsEndpoints.getAll)

      return { res }
    } catch (err) {
      return { err }
    }
  },
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
  suggest:async(projectId)=>{
    try{
      const res=await privateClient.get(
        teamsEndpoints.suggest,
        {params:{projectId:projectId}}
      );
      return {res};
    }
    catch(err){
      return {err}
    }
  }
}

export default teamsApi