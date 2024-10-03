import { createSlice } from '@reduxjs/toolkit'

export const projectsSlice = createSlice({
  name: 'Projects',
  initialState: {
    projects: []
  },
  reducers: {
    setProjects: (state, action) => {
      state.projects = action.payload.projects
    },
    addProject: (state, action) => {
      state.projects = [...state.projects, action.payload.project]
    }
  }
})

export const {
  setProjects,
  addProject
} = projectsSlice.actions

export default projectsSlice.reducer