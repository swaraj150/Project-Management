import { configureStore } from '@reduxjs/toolkit'

import userSlice from './features/userSlice'
import organizationSlice from './features/organizationSlice'
import menuSlice from './features/menuSlice'
import projectsSlice from './features/projectsSlice'
import teamsSlice from './features/teamsSlice'
import kanbanSlice  from './features/kanbanSlice'
import ganttSlice  from './features/ganttSlice'
import webSocketSlice  from './features/webSocketSlice'
const store = configureStore({
  reducer: {
    user: userSlice,
    organization: organizationSlice,
    menu: menuSlice,
    projects: projectsSlice,
    teams: teamsSlice,
    kanban: kanbanSlice,
    gantt:ganttSlice,
    webSocket:webSocketSlice
  },
  window:window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
})

export default store