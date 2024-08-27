import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: "User",
  initialState: {
    rememberMe: false,
    user: null
  },
  reducers: {
    setRememberMe: (state, action) => {
      state.rememberMe = action.payload
    },
    setUser: (state, action) => {
      if (action.payload == null) {
        localStorage.removeItem('token')
      } else {
        if (state.rememberMe && action.payload.token) localStorage.setItem('token', action.payload.token)
      }

      state.user = action.payload
    }
  }
})

export const {
  setRememberMe,
  setUser
} = userSlice.actions

export default userSlice.reducer