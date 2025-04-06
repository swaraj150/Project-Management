import { createSlice } from '@reduxjs/toolkit'

export const projectsSlice = createSlice({
  name: 'Projects',
  initialState: {
    projects: [],
    projectsMap: null
  },
  reducers: {
    setProjects: (state, action) => {
      state.projects = action.payload.map((project) => project.id)
      state.projectsMap = action.payload.reduce((acc, project) => {
        acc[project.id] = project
        return acc
      }, {})
    },
    addProject: (state, action) => {
      const { projectId } = action.payload
      state.projects = [...state.projects, projectId]
      state.projectsMap = {
        ...state.projectsMap,
        [projectId]: { ...action.payload }
      }
    }
  }
})

export const {
  setProjects,
  addProject
} = projectsSlice.actions

export default projectsSlice.reducer