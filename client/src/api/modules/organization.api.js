import privateClient from '../clients/private.client'

const organizationEndpoints = {
  create: 'organizations/initiate',
  getInfo: 'organizations/',
  join: 'organizations/join',
  search: 'organizations/search',
  fetchRequests: 'organizations/requests',
  accept: (requestId) => `organizations/requests/${requestId}/accept`,
  reject: (requestId) => `organizations/requests/${requestId}/reject`
}

const organizationApi = {
  create: async ({ name }) => {
    try {
      const res = await privateClient.post(organizationEndpoints.create, { name })
      return { res }
    } catch (err) {
      return { err }
    }
  },
  getInfo: async () => {
    try {
      const res = await privateClient.get(organizationEndpoints.getInfo)
      return { res }
    } catch (err) {
      return { err }
    }
  },
  join: async ({ code, role }) => {
    try {
      const res = await privateClient.post(
        organizationEndpoints.join,
        { code, role }
      )
      return { res }
    } catch (err) {
      return { err }
    }
  },
  search: async ({ query }) => {
    try {
      const res = await privateClient.get(
        organizationEndpoints.search,
        { params: { key: query } }
      )
      return { res }
    } catch (err) {
      return { err }
    }
  },
  fetchRequests: async () => {
    try {
      const res = await privateClient.get(
        organizationEndpoints.fetchRequests,
      )
      return { res }
    } catch (error) {
      return { err }
    }
  },
  accept: async ({ requestId }) => {
    try {
      const res = await privateClient.put(organizationApi.accept(requestId))
      return { res }
    } catch (err) {
      return { err }
    }
  },
  reject: async ({ requestId }) => {
    try {
      const res = await privateClient.put(organizationApi.reject(requestId))
      return { res }
    } catch (err) {
      return { err }
    }
  }
}

export default organizationApi