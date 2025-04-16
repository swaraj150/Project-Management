import privateClient from '../clients/private.client'

const chatEndpoints = {
  getAll: 'chats'
}

const chatsApi = {
  getAll: async () => {
    try {
      const res = await privateClient.get(chatEndpoints.getAll)
      return { res }
    } catch (err) {
      return { err }
    }
  }
}

export default chatsApi