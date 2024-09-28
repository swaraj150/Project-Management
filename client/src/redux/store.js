import { configureStore } from '@reduxjs/toolkit'

import userSlice from './features/userSlice'
import organizationSlice from './features/organizationSlice'

const store = configureStore({
  reducer: {
    user: userSlice,
    organization: organizationSlice
  }
})

export default store