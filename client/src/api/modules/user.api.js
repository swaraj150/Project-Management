import privateClient from '../clients/private.client'
import publicClient from '../clients/public.client'

const userEndpoints = {
  signin: 'users/signin',
  signup: 'users/signup',
  googleSignin: 'users/google',
  githubSignin: 'users/github',
  getInfo: 'users/me',
  getInfoById: (userId) => `users/${userId}`,
  updateProjectRole: 'users/project-role',
  updateProfile: 'users',
  logout: 'users/logout'
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
      const res = await publicClient.post(
        userEndpoints.googleSignin,
        { accessToken }
      )
      return { res }
    } catch (err) {
      return { err }
    }
  },
  githubSignin: async ({ code }) => {
    try {
      const res = await publicClient.post(
        userEndpoints.githubSignin,
        { code }
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
  },
  getInfoById: async ({ userId }) => {
    try {
      const res = await privateClient.get(userEndpoints.getInfoById(userId))
      return { res }
    } catch (err) {
      return { err }
    }
  },
  updateProfile: async ({firstname,lastname,gender,dob,phoneNumber,addressLine1,addressLine2,city,code,state,country,skills})=>{
    try {
      
      const res = await privateClient.patch(
        userEndpoints.updateProfile,
        {
          // ...user,
          firstname,
          lastname,
          gender,
          dob,
          phoneNumber,
          addressLine1,
          addressLine2,
          city,
          code,
          state,
          country,
          skills
        }
      )
      return { res }
    } catch (err) {
      return { err }
    }
  },
  updateProjectRole: async ({ userId, role }) => {
    try {
      const res = await privateClient.patch(
        userEndpoints.updateProjectRole,
        { userId, role }
      )
      return { res }
    } catch (err) {
      return { err }
    }
  },
  logout: async () => {
    try {
      const res = await privateClient.post(userEndpoints.logout)
      return { res }
    } catch (err) {
      return { err }
    }
  }
}

export default userApi