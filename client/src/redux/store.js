import { configureStore } from '@reduxjs/toolkit'

import userSlice from './features/userSlice'
import organizationSlice from './features/organizationSlice'
import menuSlice from './features/menuSlice'

const store = configureStore({
  reducer: {
    user: userSlice,
    organization: organizationSlice,
    menu: menuSlice
  }
})

export default store