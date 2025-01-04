import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'User',
  initialState: {
    // user:null 
    user:{"name":"Alice Brown","username":"Alice_Brown6565","emails":["alice.brown@example.com"],"role":"USER","projectRole":"TEAM_LEAD"}
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