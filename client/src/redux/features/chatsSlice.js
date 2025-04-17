import { createSlice } from '@reduxjs/toolkit'

export const chatsSlice = createSlice({
  name: 'Chats',
  initialState: {
    chats: null
  },
  reducers: {
    setChats: (state, action) => {
      state.chats = action.payload
    },
    addChat: (state, action) => {
      const { id, chat } = action.payload
      if (!state.chats[id]) {
        state.chats[id] = []
      }
      state.chats[id].push(chat)
    }
  }
})

export const { 
  setChats,
  addChat
} = chatsSlice.actions

export default chatsSlice.reducer