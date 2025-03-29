import privateClient from "../clients/private.client"

const chatRoomEndpoints = {
  create: 'chatrooms/create',
  join: 'chatrooms/join'
}

const chatRoomApi = {
  create: async ({ name, projectId, teams, teamId, taskId }) => {
    try {
      const res = await privateClient.post(
        chatRoomEndpoints.create,
        { name, projectId, teams, teamId, taskId }
      )
      return { res }
    } catch (error) {
      return { error }
    }
  },
  join: async ({ roomId }) => {
    try {
      const res = await privateClient.put(
        chatRoomEndpoints.join,
        { roomId }
      )
      return { res }
    } catch (error) {
      return { error }
    }
  }
}

export default chatRoomApi