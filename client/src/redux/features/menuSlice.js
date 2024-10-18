import { createSlice } from '@reduxjs/toolkit'

export const menuSlice = createSlice({
  name: 'Menu',
  initialState: {
    active: 0
  },
  reducers: {
    setActive: (state, action) => {
      state.active = action.payload
    }
  }
})

export const {
  setActive,
} = menuSlice.actions

export default menuSlice.reducer