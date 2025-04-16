import { createSlice } from '@reduxjs/toolkit'

import { roles } from '../../utils/organization.utils'

export const organizationSlice = createSlice({
  name: 'Organization',
  initialState: {
    organization: null,
    members: [],
    managers: [],
    developers: [],
    testers: [],
    stakeholders: [],
    membersMap: null,
    requests: []
  },
  reducers: {
    setOrganization: (state, action) => {
      state.organization = action.payload
      state.members = state.organization.members.map((member) => member.userId)
      state.managers = action.payload.managers
      state.developers = action.payload.developers
      state.testers = action.payload.testers
      state.stakeholders = action.payload.stakeholders
      state.membersMap = action.payload.members.reduce((acc, member) => {
        acc[member.userId] = member
        return acc
      }, {})
      delete state.organization.members
    },
    addMember: (state, action) => {
      const { userId, projectRole } = action.payload
      state.members.push(userId)
      
      switch (projectRole) {
        case roles.projectManager:
          state.managers.push(userId)
          break
        case roles.developer:
          state.developers.push(userId)
          break
        case roles.qa:
          state.testers.push(userId)
          break
        case roles.stakeholder:
          state.stakeholders.push(userId)
          break
      }
      
      state.membersMap[userId] = { ...action.payload }
    },
    removeMember: (state, action) => {
      const { userId, projectRole } = action.payload
      
      state.members = state.members.filter((id) => id !== userId)
      
      switch (projectRole) {
        case roles.projectManager:
          state.managers = state.managers.filter((id) => id !== userId)
          break
        case roles.developer:
          state.developers = state.developers.filter((id) => id !== userId)
          break
        case roles.qa:
          state.testers = state.testers.filter((id) => id !== userId)
          break
        case roles.stakeholder:
          state.stakeholders = state.stakeholders.filter((id) => id !== userId)
          break
      }
      
      delete state.membersMap[userId]
    },
    changeMemberRole: (state, action) => {
      const { memberId, newRole } = action.payload
      const oldRole = state.membersMap[memberId].projectRole
      
      switch (oldRole) {
        case roles.projectManager:
          state.managers = state.managers.filter((id) => id !== memberId)
          break
        case roles.developer:
          state.developers = state.developers.filter((id) => id !== memberId)
          break
        case roles.qa:
          state.testers = state.testers.filter((id) => id !== memberId)
          break
        case roles.stakeholder:
          state.stakeholders = state.stakeholders.filter((id) => id !== memberId)
          break
      }
      
      switch (newRole) {
        case roles.projectManager:
          state.managers.push(memberId)
          break
        case roles.developer:
          state.developers.push(memberId)
          break
        case roles.qa:
          state.testers.push(memberId)
          break
        case roles.stakeholder:
          state.stakeholders.push(memberId)
          break
      }
      
      state.membersMap[memberId].projectRole = newRole
    },
    setRequests: (state, action) => {
      state.requests = action.payload
    },
    addRequest: (state, action) => {
      state.requests.push(action.payload)
    },
    removeRequest: (state, action) => {
      const { requestId } = action.payload
      state.requests = state.requests.filter((request) => request.id !== requestId)
    }
  }
})

export const {
  setOrganization,
  addMember,
  removeMember,
  changeMemberRole,
  setRequests,
  addRequest,
  removeRequest
} = organizationSlice.actions

export default organizationSlice.reducer