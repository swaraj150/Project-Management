import privateClient from  '../clients/private.client'

const organizationEndpoints = {
  create: 'organizations/initiate',
  getInfo: 'organizations/',
  join: 'organizations/join',
  search: 'organizations/search'
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
  join: async ({ code }) => {
    try {
      const res = await privateClient.post(
        organizationEndpoints.join, 
        {},
        { params: { code } }
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
  }
}

export default organizationApi