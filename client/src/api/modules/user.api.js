import privateClient from  '../clients/private.client'
import publicClient from '../clients/public.client'

const userEndpoints = {
  signin: 'users/login',
  signup: 'users/register',
  googleSignin: 'users/google',
  githubSignin: 'users/github',
  getInfo: 'users',
  updateProjectRole: 'update-project-role'
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
  signup: async ({ firstname, lastname, email, password }) => {
    try {
      const name = firstname + " " + lastname

      const res = await publicClient.post(
        userEndpoints.signup,
        { name, email, password }
      )

      return { res }
    } catch (err) {
      return { err }
    }
  },
  googleSignin: async ({ accessToken }) => {
    try {
      const res = await publicClient.post(userEndpoints.googleSignin, { accessToken })

      return { res }
    } catch (err) {
      return { err }
    }
  },
  githubSignin: async ({ code }) => {
    try {
      const res = await publicClient.post(userEndpoints.githubSignin, { code })

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
  },
  updateProjectRole: async ({ userId, role }) => {
    try {
      const res = await privateClient.get(userEndpoints.updateProjectRole, { userId, role })

      return { res }
    } catch (err) {
      return { err }
    }
  }
}

export default userApi