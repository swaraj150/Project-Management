import { createSlice } from '@reduxjs/toolkit'

export const organizationSlice = createSlice({
  name: 'Organization',
  initialState: {
    organization: null
  },
  reducers: {
    setOrganization: (state, action) => {
      state.organization = action.payload.organization
    }
  }
})

export const {
  setOrganization
} = organizationSlice.actions

export default organizationSlice.reducer