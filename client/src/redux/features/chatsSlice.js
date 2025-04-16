import { createSlice } from '@reduxjs/toolkit'

export const chatsSlice = createSlice({
  name: 'Chats',
  initialState: {
    organizationChats: [],
    projectChats: {}, 
    taskChats: {}
  },
  reducers: {
    setChats: (state, action) => {
      state.organizationChats = action.payload.organizationChats
      state.projectChats = action.payload.projectChats
      state.taskChats = action.payload.taskChats
    },
    addChatToOrganization: (state, action) => {
      const { chat } = action.payload
      state.organizationChats.push(chat)
    },
    addChatToProject: (state, action) => {
      const { projectId, chat } = action.payload
      if (!state.projectChats[projectId]) {
        state.projectChats[projectId] = []
      }
      state.projectChats[projectId].push(chat)
    },
    addChatToTask: (state, action) => {
      const { taskId, chat } = action.payload
      if (!state.taskChats[taskId]) {
        state.taskChats[taskId] = []
      }
      state.taskChats[taskId].push(chat)
    }
  }
})

export const { 
  setChats,
  addChatToOrganization,
  addChatToProject,
  addChatToTask
} = chatsSlice.actions

export default chatsSlice.reducer