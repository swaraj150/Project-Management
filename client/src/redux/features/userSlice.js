import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'User',
  initialState: {
    user: {
      name: "Alice Johnson",
      username: "alice_johnson",
      emails: ["alice.johnson@techinnovations.com"],
      role: "USER",
      projectRole: "Product Owner"
    }
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user
    }
  }
})

export const {
  setUser
} = userSlice.actions

export default userSlice.reducer