import { createSlice } from '@reduxjs/toolkit'

export const organizationSlice = createSlice({
  name: 'Organization',
  initialState: {
    organization: null,
    requests: [
      
    ]
  },
  reducers: {
    setOrganization: (state, action) => {
      state.organization = action.payload.organization
    },
    addMember: (state, action) => {
      state.organization.members = [...state.organization.members, action.payload]
    },
    setRequests: (state, action) => {
      state.requests = action.payload.requests
    },
    removeRequest: (state, action) => {
      const { requestId } = action.payload
      state.requests = [...state.requests.filter((request) => request.id !== requestId)]
    }
  }
})

export const {
  setOrganization,
  addMember,
  changeMemberRole,
  setRequests,
  removeRequest
} = organizationSlice.actions

export default organizationSlice.reducer