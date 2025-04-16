import { configureStore } from '@reduxjs/toolkit'

import userSlice from './features/userSlice'
import organizationSlice from './features/organizationSlice'
import menuSlice from './features/menuSlice'
import projectsSlice from './features/projectsSlice'
import teamsSlice from './features/teamsSlice'
import tasksSlice from './features/tasksSlice'
import chatsSlice from './features/chatsSlice'

const store = configureStore({
  reducer: {
    user: userSlice,
    organization: organizationSlice,
    menu: menuSlice,
    projects: projectsSlice,
    teams: teamsSlice,
    tasks: tasksSlice,
    chats: chatsSlice
  }
})

export default store