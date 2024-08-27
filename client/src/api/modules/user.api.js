import privateClient from  '../clients/private.client'
import publicClient from '../clients/public.client'

const userEndpoints = {
  signin: 'users/signin',
  signup: 'users/signup ',
  getInfo: 'users'
}

const userApi = {
  signin: async ({ username, password }) => {
    try {
      const res = await publicClient.post(
        userEndpoints.signin,
        { username, password }
      )

      return { res }
    } catch (err) {
      return { err }
    }
  },
  signup: async ({ firstname, lastname, username, email, password }) => {
    try {
      const name = firstname + " " + lastname

      const res = await publicClient.post(
        userEndpoints.signup,
        { name, username, email, password }
      )

      return { res }
    } catch (err) {
      return { err }
    }
  },
  getInfo: async () => {
    try {
      const res = await privateClient.get(userEndpoints.getInfo)

      return { res }
    } catch (err) {
      return { err }
    }
  }
}

export default userApi