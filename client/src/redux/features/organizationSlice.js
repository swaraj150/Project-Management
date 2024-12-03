import { createSlice } from '@reduxjs/toolkit'

export const organizationSlice = createSlice({
  name: 'Organization',
  initialState: {
    organization: {"id":"20f29413-66d0-4fe4-bcd7-a90313f3f44c","name":"test_org","productOwner":{"name":"James Lee","username":"James_Lee2805","emails":["james.lee@example.com"],"role":"USER","projectRole":"PRODUCT_OWNER"},"stakeholders":[],"members":[{"name":"James Lee","username":"James_Lee2805","emails":["james.lee@example.com"],"role":"USER","projectRole":"PRODUCT_OWNER"},{"name":"Alice Brown","username":"Alice_Brown6565","emails":["alice.brown@example.com"],"role":"USER","projectRole":"TEAM_LEAD"},{"name":"Jane Smith","username":"Jane_Smith8792","emails":["jane.smith@example.com"],"role":"USER","projectRole":"DEVELOPER"},{"name":"Sarah Wilson","username":"Sarah_Wilson3123","emails":["sarah.wilson@example.com"],"role":"USER","projectRole":"QA"},{"name":"nikhil dhumal","username":"nikhil_dhumal2739","emails":["abc@example.com"],"role":"USER","projectRole":"DEVELOPER"},{"name":"Chris Brown","username":"Chris_Brown7542","emails":["chris.brown@example.com"],"role":"USER","projectRole":"DEVELOPER"},{"name":"ayush makade","username":"ayush_makade9942","emails":["abc@gmail.com"],"role":"USER","projectRole":"QA"},{"name":"John Doe","username":"John_Doe8344","emails":["john.doe@example.com"],"role":"USER","projectRole":"PROJECT_MANAGER"}],"code":"4a3377c"},
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