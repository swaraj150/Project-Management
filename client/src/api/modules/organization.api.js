import privateClient from '../clients/private.client'

const organizationEndpoints = {
  create: 'organizations',
  getInfo: 'organizations/info',
  getMembers: 'organizations/members',
  join: 'organizations/join',
  search: 'organizations/search',
  fetchRequests: 'organizations/requests',
  accept: 'organizations/requests/accept',
  reject: 'organizations/requests/reject',
  remove: 'organizations/members'
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
  getMembers: async () => {
    try {
      const res = await privateClient.get(organizationEndpoints.getMembers)
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
        { params: { query } }
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
    } catch (err) {
      return { err }
    }
  },
  accept: async ({ requestId }) => {
    try {
      const res = await privateClient.patch(
        organizationEndpoints.accept,
        { requestId }
      )
      return { res }
    } catch (err) {
      return { err }
    }
  },
  reject: async ({ requestId }) => {
    try {
      const res = await privateClient.patch(
        organizationEndpoints.reject,
        { requestId }
      )
      return { res }
    } catch (err) {
      return { err }
    }
  },
  remove: async ({ memberId }) => {
    try {
      const res = await privateClient.delete(
        organizationEndpoints.remove,
        { data: { memberId } }
      )
      return { res }
    } catch (err) {
      return { err }
    }
  }
}

export default organizationApi