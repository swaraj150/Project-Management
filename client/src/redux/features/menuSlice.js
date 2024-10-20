import { createSlice } from '@reduxjs/toolkit'

export const menuSlice = createSlice({
  name: 'Menu',
  initialState: {
    active: 0,
    collapsed: false
  },
  reducers: {
    setActive: (state, action) => {
      state.active = action.payload
    },
    setCollapsed: (state, action) => {
      state.collapsed = action.payload
    }
  }
})

export const {
  setActive,
  setCollapsed
} = menuSlice.actions

export default menuSlice.reducer