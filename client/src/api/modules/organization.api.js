import privateClient from  '../clients/private.client'

const organizationEndpoints = {
  getInfo: 'organizations/',
  create: 'organizations/initiate',
  join: 'organizations/join',
  search: 'organizations/search'
}

const organizationApi = {
  getInfo: async () => {
    try {
      const res = await privateClient.get(organizationEndpoints.getInfo)

      return { res }
    } catch (err) {
      return { err }
    }
  },
  create: async ({ name }) => {
    try {
      const res = await privateClient.post(organizationEndpoints.create, { name })

      return { res }
    } catch (err) {
      return { err }
    }
  },
  join: async ({ code }) => {
    try {
      const res = await privateClient.post(organizationEndpoints.join, { code })

      return { res }
    } catch (err) {
      return { err }
    }
  },
  search: async ({ query }) => {
    try {
      const res = await privateClient.post(organizationEndpoints.search, { query })

      return { res }
    } catch (err) {
      return { err }
    }
  }
}

export default organizationApi